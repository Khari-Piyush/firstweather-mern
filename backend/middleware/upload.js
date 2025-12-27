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

// ✅ ALLOW images + csv + zip
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/",
    "text/csv",
    "application/zip",
    "application/x-zip-compressed",
  ];

  if (
    allowedTypes.some((type) =>
      file.mimetype.startsWith(type)
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images, CSV, and ZIP files are allowed"
      ),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
