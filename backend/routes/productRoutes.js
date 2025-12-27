import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // multer LOCAL
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import csv from "csvtojson";
import unzipper from "unzipper";
import path from "path";

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ productName: 1 }) // 🔥 A → Z order
      .lean(); // fast

    res.json(products);
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================= GET PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/bulk-upload-with-images",
  upload.fields([
    { name: "csv", maxCount: 1 },
    { name: "zip", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("FILES:", req.files);

      if (!req.files?.csv || !req.files?.zip) {
        return res.status(400).json({ message: "CSV and ZIP both required" });
      }

      const csvFile = req.files.csv[0];
      const zipFile = req.files.zip[0];
      
      console.log("CSV PATH:", csvFile?.path);
      

      const extractPath = `uploads/extracted-${Date.now()}`;
      fs.mkdirSync(extractPath);

      await fs
        .createReadStream(zipFile.path)
        .pipe(unzipper.Extract({ path: extractPath }))
        .promise();

      const products = await csv().fromFile(csvFile.path);
      console.log("CSV DATA:", products);
      const finalProducts = [];

      for (let p of products) {
        const imagePath = path.join(extractPath, p.image);

        if (!fs.existsSync(imagePath)) {
          console.warn(`Image not found for ${p.productName}`);
          continue; // ❗ skip invalid product
        }

        const uploadRes = await cloudinary.uploader.upload(imagePath, {
          folder: "fwproducts",
        });

        finalProducts.push({
          productName: p.productName,
          productId: p.productId,
          slug: p.slug,
          description: p.description,
          price: Number(p.price),
          category: p.category,
          carModel: p.carModel,
          imageUrl: uploadRes.secure_url, // ✅ CORRECT
        });
      }

      if (!finalProducts.length) {
        return res.status(400).json({ message: "No valid products found" });
      }

      await Product.insertMany(finalProducts);

      res.json({
        message: "Bulk upload successful",
        count: finalProducts.length,
      });
    } catch (err) {
      console.error("Bulk upload error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);


/* ================= CREATE PRODUCT ================= */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        productId,
        productName,
        slug,
        description,
        price,
        category,
        carModel,
      } = req.body;
      console.log("FILE:", req.file);


      // 🔐 VALIDATION
      if (!productId || !productName || !slug || !price) {
        return res.status(400).json({
          message: "productId, productName, slug, price are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Product image is required",
        });
      }

      // 🔁 DUPLICATE CHECK
      if (await Product.findOne({ productId })) {
        return res.status(400).json({ message: "Product ID already exists" });
      }

      if (await Product.findOne({ slug })) {
        return res.status(400).json({ message: "Slug already exists" });
      }

      // ☁️ UPLOAD TO CLOUDINARY
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "fwproducts",
        }
      );

      // 🧹 DELETE LOCAL FILE
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("File delete warning:", err.message);
      });


      // 🌐 CLOUDINARY URL
      const imageUrl = result.secure_url;

      // 💾 SAVE PRODUCT
      const product = await Product.create({
        productId,
        productName,
        slug,
        description,
        price,
        category,
        carModel,
        imageUrl,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error("Create product error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);



/* ================= UPDATE PRODUCT ================= */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const updates = { ...req.body };

      if (req.file) {
        const result = await cloudinary.uploader.upload(
          req.file.path,
          { folder: "fwproducts" }
        );

        fs.unlinkSync(req.file.path);

        updates.imageUrl = result.secure_url;
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (err) {
      console.error("Update product error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
