import nodemailer from "nodemailer";

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

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

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

/* Sends the admin notification email with the inquiry details and, if
 * available, the generated PDF attached. */
export const sendAdminInquiryEmail = async (inquiry, pdfBuffer) => {
  const location = [inquiry.city, inquiry.country].filter(Boolean).join(", ");

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

  await getTransporter().sendMail({
    from: `"First Weather Inquiries" <${process.env.MAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New Inquiry ${inquiry.inquiryId} — ${inquiry.items.length} item(s)`,
    html,
    attachments: pdfBuffer
      ? [{ filename: `${inquiry.inquiryId}.pdf`, content: pdfBuffer, contentType: "application/pdf" }]
      : [],
  });
};

/* Sends the customer-facing confirmation email with the Inquiry ID and an
 * optional link to the generated PDF. */
export const sendCustomerConfirmationEmail = async (inquiry) => {
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

  await getTransporter().sendMail({
    from: `"First Weather" <${process.env.MAIL_USER}>`,
    to: inquiry.customerEmail,
    subject: `Your Inquiry ${inquiry.inquiryId} has been received — First Weather`,
    html,
  });
};

/* Builds a wa.me click-to-chat URL (to the business number) pre-filled with
 * the full inquiry details and PDF link. WhatsApp links cannot auto-attach
 * files, so the PDF URL is included as plain text for the recipient to open. */
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
