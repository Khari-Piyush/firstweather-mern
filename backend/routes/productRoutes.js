import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // multer LOCAL
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
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
