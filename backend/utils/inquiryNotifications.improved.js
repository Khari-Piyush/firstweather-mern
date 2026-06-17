import nodemailer from "nodemailer";
import logger from "../config/logger.js";

const NAVY = "#0f172a";
const GRAY_500 = "#6b7280";
const ADMIN_EMAIL = "firstweather16@gmail.com";
const WA_NUMBER = "917428088039";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Transport selection ──────────────────────────────────────────────────────
//
// RESEND_API_KEY present → Resend HTTP API (HTTPS only, no SMTP ports needed,
//   reliable on Render). Requires a verified sending domain on resend.com and
//   RESEND_FROM env var (e.g. "First Weather <inquiries@firstweather.com>").
//
// Otherwise → Gmail SMTP on port 587 (STARTTLS). Port 465 (SSL) was blocked
//   on Render causing ETIMEDOUT; 587 is the standard submission port and is
//   allowed. Requires MAIL_USER + MAIL_PASS (Gmail App Password).

const useResend = () => Boolean(process.env.RESEND_API_KEY);

const getSmtpTransporter = () => {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  if (!user || !pass) {
    throw new Error("MAIL_USER or MAIL_PASS env var not set — email disabled");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,     // STARTTLS — port 465 (SSL) is blocked on Render
    secure: false, // false = upgrade to TLS via STARTTLS after connect
    auth: { user, pass },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
  });
};

// Sends one email via the Resend HTTP API.
// Uses native fetch (Node 18+) — no extra npm package needed.
// Resend docs: https://resend.com/docs/api-reference/emails/send-email
const resendSend = async ({ from, to, subject, html, pdfBuffer, pdfFilename }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const payload = { from, to: [to], subject, html };
  if (pdfBuffer && pdfFilename) {
    payload.attachments = [{ filename: pdfFilename, content: pdfBuffer.toString("base64") }];
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "(no body)");
    throw new Error(`Resend API ${r.status}: ${text}`);
  }
};

// ── Startup config check ─────────────────────────────────────────────────────
// Call once at server start to surface bad credentials in Render boot logs.
// Resolves silently on success; rejects with a descriptive Error (safe to log).
export const verifySmtpConfig = () => {
  if (useResend()) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return Promise.reject(new Error("RESEND_API_KEY not set"));
    const from = process.env.RESEND_FROM;
    if (!from) {
      logger.warn("RESEND_FROM env var not set — Resend emails will fail to send");
    }
    return fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => {
      if (!r.ok) throw new Error(`Resend API key check failed: HTTP ${r.status}`);
    });
  }
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  if (!user || !pass) {
    return Promise.reject(new Error("MAIL_USER or MAIL_PASS env var not set"));
  }
  return getSmtpTransporter().verify();
};

// ── Email content helpers ────────────────────────────────────────────────────

const itemsHtmlRows = (items) =>
  items
    .map(
      (item, i) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${i + 1}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${item.productCode || "—"}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.qty}</td>
        </tr>`
    )
    .join("");

const emailShell = (titleHtml, bodyHtml) => `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
    <div style="background:${NAVY};color:#ffffff;padding:20px 24px;">
      ${titleHtml}
    </div>
    <div style="padding:20px 24px;">
      ${bodyHtml}
    </div>
  </div>
`;

const itemsTable = (items) => `
  <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;">
    <thead>
      <tr style="background:#f3f4f6;text-align:left;">
        <th style="padding:6px 10px;">#</th>
        <th style="padding:6px 10px;">Code</th>
        <th style="padding:6px 10px;">Product</th>
        <th style="padding:6px 10px;text-align:right;">Qty</th>
      </tr>
    </thead>
    <tbody>${itemsHtmlRows(items)}</tbody>
  </table>
`;

// ── Public send functions ────────────────────────────────────────────────────

export const sendAdminInquiryEmail = async (inquiry, pdfBuffer) => {
  const location = [inquiry.city, inquiry.country].filter(Boolean).join(", ");
  const transport = useResend() ? "resend" : "smtp";

  const body = `
    <h3 style="margin-top:0;">Customer Details</h3>
    <p style="margin:4px 0;"><b>Name:</b> ${inquiry.customerName}</p>
    ${inquiry.company ? `<p style="margin:4px 0;"><b>Company:</b> ${inquiry.company}</p>` : ""}
    <p style="margin:4px 0;"><b>Email:</b> ${inquiry.customerEmail}</p>
    <p style="margin:4px 0;"><b>Phone:</b> ${inquiry.customerPhone}</p>
    ${location ? `<p style="margin:4px 0;"><b>Location:</b> ${location}</p>` : ""}

    <h3>Requested Items</h3>
    ${itemsTable(inquiry.items)}

    ${inquiry.notes ? `<h3>Notes</h3><p>${inquiry.notes}</p>` : ""}

    ${inquiry.pdfUrl ? `<p><a href="${inquiry.pdfUrl}">View / download quotation request PDF</a></p>` : ""}
  `;

  const html = emailShell(
    `<h2 style="margin:0;">New Inquiry Received</h2>
     <p style="margin:4px 0 0;color:#cbd5e1;">${inquiry.inquiryId} &middot; ${formatDate(inquiry.createdAt || new Date())}</p>`,
    body
  );

  const subject = `New Inquiry ${inquiry.inquiryId} — ${inquiry.items.length} item(s)`;

  if (useResend()) {
    const from = process.env.RESEND_FROM;
    if (!from) throw new Error("RESEND_FROM env var not set — cannot send admin notification");
    await resendSend({ from, to: ADMIN_EMAIL, subject, html, pdfBuffer, pdfFilename: `${inquiry.inquiryId}.pdf` });
  } else {
    await getSmtpTransporter().sendMail({
      from: `"First Weather Inquiries" <${process.env.MAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
      attachments: pdfBuffer
        ? [{ filename: `${inquiry.inquiryId}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
        : [],
    });
  }

  logger.info({ inquiryId: inquiry.inquiryId, transport }, "admin notification email sent");
};

export const sendCustomerConfirmationEmail = async (inquiry) => {
  const transport = useResend() ? "resend" : "smtp";

  const body = `
    <h3 style="margin-top:0;">Thank you, ${inquiry.customerName}!</h3>
    <p>We've received your inquiry and our team will get back to you within
    24 hours with pricing and availability.</p>

    <p style="margin:16px 0;">
      <span style="color:${GRAY_500};">Your Inquiry ID</span><br/>
      <b style="font-size:18px;letter-spacing:1px;">${inquiry.inquiryId}</b>
    </p>

    <h3>Items Requested</h3>
    ${itemsTable(inquiry.items)}

    ${inquiry.pdfUrl ? `<p><a href="${inquiry.pdfUrl}">Download your quotation request (PDF)</a></p>` : ""}

    <p style="margin-top:20px;color:${GRAY_500};font-size:13px;">
      Questions? Reply to this email or reach us on
      <a href="https://wa.me/${WA_NUMBER}">WhatsApp</a> at +91 7428088039.
    </p>
  `;

  const html = emailShell(
    `<h2 style="margin:0;">First Weather</h2>
     <p style="margin:4px 0 0;color:#cbd5e1;">Wiper Parts Manufacturer</p>`,
    body
  );

  const subject = `Your Inquiry ${inquiry.inquiryId} has been received — First Weather`;

  if (useResend()) {
    const from = process.env.RESEND_FROM;
    if (!from) throw new Error("RESEND_FROM env var not set — cannot send customer confirmation");
    await resendSend({ from, to: inquiry.customerEmail, subject, html });
  } else {
    await getSmtpTransporter().sendMail({
      from: `"First Weather" <${process.env.MAIL_USER}>`,
      to: inquiry.customerEmail,
      subject,
      html,
    });
  }

  logger.info({ inquiryId: inquiry.inquiryId, transport }, "customer confirmation email sent");
};

export const buildInquiryWhatsappUrl = (inquiry) => {
  const location = [inquiry.city, inquiry.country].filter(Boolean).join(", ");

  const lines = [
    `New Inquiry: ${inquiry.inquiryId}`,
    "",
    `Name: ${inquiry.customerName}`,
    inquiry.company ? `Company: ${inquiry.company}` : null,
    `Phone: ${inquiry.customerPhone}`,
    `Email: ${inquiry.customerEmail}`,
    location ? `Location: ${location}` : null,
    "",
    "Items:",
    ...inquiry.items.map((item, i) => `${i + 1}. ${item.productName}${item.productCode ? ` (${item.productCode})` : ""} x ${item.qty}`),
    inquiry.notes ? "" : null,
    inquiry.notes ? `Notes: ${inquiry.notes}` : null,
    "",
    inquiry.pdfUrl ? `PDF: ${inquiry.pdfUrl}` : null,
  ].filter((l) => l !== null);

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
};
