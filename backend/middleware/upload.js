import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Images
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  // CSV (ALL common cases)
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.originalname.endsWith(".csv")
  ) {
    return cb(null, true);
  }

  // ZIP
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.originalname.endsWith(".zip")
  ) {
    return cb(null, true);
  }

  cb(new Error("Only images, CSV, and ZIP files are allowed"));
};

const upload = multer({ storage, fileFilter });

export default upload;
