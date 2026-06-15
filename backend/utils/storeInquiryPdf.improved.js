import fs from "fs";
import path from "path";

const PDF_DIR = path.join(process.cwd(), "uploads", "inquiries");

// Persists a generated inquiry PDF to local disk under
// uploads/inquiries/<inquiryId>.pdf and returns the absolute file path.
export const saveInquiryPdfFile = (buffer, inquiryId) => {
  fs.mkdirSync(PDF_DIR, { recursive: true });
  const filePath = path.join(PDF_DIR, `${inquiryId}.pdf`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const inquiryPdfFilePath = (inquiryId) =>
  path.join(PDF_DIR, `${inquiryId}.pdf`);
