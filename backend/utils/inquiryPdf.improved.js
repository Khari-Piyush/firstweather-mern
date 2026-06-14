import PDFDocument from "pdfkit";

const NAVY = "#0f172a";
const NAVY_MID = "#1e3a8a";
const GRAY_500 = "#6b7280";
const GRAY_300 = "#d1d5db";
const GRAY_100 = "#f3f4f6";

const MARGIN = 50;
const PAGE_WIDTH = 595.28; // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_RESERVED = 90;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const drawHeader = (doc, inquiry) => {
  doc.font("Helvetica-Bold").fontSize(20).fillColor(NAVY)
    .text("FIRST WEATHER", MARGIN, MARGIN);
  doc.font("Helvetica").fontSize(9).fillColor(GRAY_500)
    .text("Wiper Parts Manufacturer", MARGIN, MARGIN + 24);

  doc.font("Helvetica-Bold").fontSize(9).fillColor(GRAY_500)
    .text("QUOTATION REQUEST", MARGIN, MARGIN, { width: CONTENT_WIDTH, align: "right" });
  doc.font("Helvetica-Bold").fontSize(12).fillColor(NAVY)
    .text(inquiry.inquiryId, MARGIN, MARGIN + 14, { width: CONTENT_WIDTH, align: "right" });
  doc.font("Helvetica").fontSize(9).fillColor(GRAY_500)
    .text(formatDate(inquiry.createdAt || new Date()), MARGIN, MARGIN + 30, { width: CONTENT_WIDTH, align: "right" });

  const dividerY = MARGIN + 56;
  doc.moveTo(MARGIN, dividerY).lineTo(MARGIN + CONTENT_WIDTH, dividerY)
    .strokeColor(GRAY_300).lineWidth(1).stroke();

  doc.y = dividerY + 20;
};

const drawLabelValue = (doc, label, value, x, y, width) => {
  doc.font("Helvetica").fontSize(9).fillColor(GRAY_500)
    .text(`${label}:`, x, y, { width: 65 });
  doc.font("Helvetica-Bold").fontSize(10).fillColor(NAVY)
    .text(value, x + 65, y, { width: width - 65 });
};

const drawCustomerDetails = (doc, inquiry) => {
  const startY = doc.y;
  const colWidth = CONTENT_WIDTH / 2 - 10;

  doc.font("Helvetica-Bold").fontSize(9).fillColor(GRAY_500)
    .text("CUSTOMER DETAILS", MARGIN, startY);

  let y = startY + 18;

  const left = [["Name", inquiry.customerName]];
  if (inquiry.company) left.push(["Company", inquiry.company]);

  const right = [
    ["Email", inquiry.customerEmail],
    ["Phone", inquiry.customerPhone],
  ];
  const location = [inquiry.city, inquiry.country].filter(Boolean).join(", ");
  if (location) right.push(["Location", location]);

  const rows = Math.max(left.length, right.length);
  for (let i = 0; i < rows; i++) {
    if (left[i]) drawLabelValue(doc, left[i][0], left[i][1], MARGIN, y, colWidth);
    if (right[i]) drawLabelValue(doc, right[i][0], right[i][1], MARGIN + colWidth + 20, y, colWidth);
    y += 18;
  }

  doc.y = y + 14;
};

const COL = {
  no: { x: MARGIN, w: 35 },
  code: { x: MARGIN + 35, w: 105 },
  name: { x: MARGIN + 35 + 105, w: CONTENT_WIDTH - 35 - 105 - 60 },
  qty: { x: MARGIN + CONTENT_WIDTH - 60, w: 60 },
};

const drawTableHeaderRow = (doc, y) => {
  doc.rect(MARGIN, y, CONTENT_WIDTH, 24).fill(NAVY);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff");
  doc.text("#", COL.no.x + 8, y + 8);
  doc.text("PRODUCT CODE", COL.code.x, y + 8);
  doc.text("PRODUCT NAME", COL.name.x, y + 8);
  doc.text("QTY", COL.qty.x, y + 8, { width: COL.qty.w, align: "right" });
  return y + 24;
};

const drawItemsTable = (doc, inquiry) => {
  let y = drawTableHeaderRow(doc, doc.y);

  inquiry.items.forEach((item, idx) => {
    doc.font("Helvetica").fontSize(10);
    const nameHeight = doc.heightOfString(item.productName, { width: COL.name.w });
    const rowHeight = Math.max(24, nameHeight + 12);

    if (y + rowHeight > doc.page.height - FOOTER_RESERVED) {
      doc.addPage();
      y = drawTableHeaderRow(doc, MARGIN);
    }

    if (idx % 2 === 1) {
      doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill(GRAY_100);
    }

    doc.font("Helvetica").fontSize(10).fillColor(NAVY)
      .text(String(idx + 1), COL.no.x + 8, y + 7);
    doc.fillColor(GRAY_500)
      .text(item.productCode || "—", COL.code.x, y + 7, { width: COL.code.w });
    doc.fillColor(NAVY)
      .text(item.productName, COL.name.x, y + 7, { width: COL.name.w });
    doc.font("Helvetica-Bold")
      .text(String(item.qty), COL.qty.x, y + 7, { width: COL.qty.w, align: "right" });

    doc.moveTo(MARGIN, y + rowHeight).lineTo(MARGIN + CONTENT_WIDTH, y + rowHeight)
      .strokeColor(GRAY_300).lineWidth(0.5).stroke();

    y += rowHeight;
  });

  doc.y = y + 20;
};

const drawNotes = (doc, inquiry) => {
  if (!inquiry.notes) return;

  if (doc.y + 60 > doc.page.height - FOOTER_RESERVED) {
    doc.addPage();
    doc.y = MARGIN;
  }

  doc.font("Helvetica-Bold").fontSize(9).fillColor(GRAY_500)
    .text("ADDITIONAL NOTES", MARGIN, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(10).fillColor(NAVY)
    .text(inquiry.notes, MARGIN, doc.y, { width: CONTENT_WIDTH });
  doc.y += 16;
};

const drawDisclaimer = (doc) => {
  if (doc.y + 40 > doc.page.height - FOOTER_RESERVED) {
    doc.addPage();
    doc.y = MARGIN;
  }
  doc.font("Helvetica-Oblique").fontSize(9).fillColor(GRAY_500)
    .text(
      "This document is a request for quotation only. Prices, availability and lead times will be confirmed by our sales team separately.",
      MARGIN, doc.y, { width: CONTENT_WIDTH }
    );
};

const drawFooters = (doc) => {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const y = doc.page.height - 70;

    doc.moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_WIDTH, y)
      .strokeColor(GRAY_300).lineWidth(1).stroke();

    doc.font("Helvetica-Bold").fontSize(8).fillColor(NAVY)
      .text("First Weather — Wiper Parts Manufacturer", MARGIN, y + 8, { width: CONTENT_WIDTH });

    doc.font("Helvetica").fontSize(8).fillColor(GRAY_500)
      .text(
        "Office: WP-406 B, Wazirpur Village, Ashok Vihar, Delhi - 110052  |  Shop: 245/1A, Punja Sharif Market, Kashmere Gate, Delhi - 110006",
        MARGIN, y + 20, { width: CONTENT_WIDTH }
      );

    doc.font("Helvetica").fontSize(8).fillColor(NAVY_MID)
      .text(
        `Phone: +91 7428088039   |   Email: firstweather16@gmail.com   |   Page ${i + 1} of ${range.count}`,
        MARGIN, y + 32, { width: CONTENT_WIDTH }
      );
  }
};

// Renders a single-page-or-more A4 quotation-request PDF for an inquiry
// and resolves with the complete file as a Buffer.
export const generateInquiryPdfBuffer = (inquiry) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: MARGIN, bufferPages: true });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      drawHeader(doc, inquiry);
      drawCustomerDetails(doc, inquiry);
      drawItemsTable(doc, inquiry);
      drawNotes(doc, inquiry);
      drawDisclaimer(doc);
      drawFooters(doc);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
