import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // 👈 multer + cloudinary

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
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

/* ================= CREATE PRODUCT (WITH IMAGE) ================= */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // 👈 image upload
  async (req, res) => {
    try {
      const {
        productId,
        productName,
        slug,
        description,
        price,
        carModel,
        compatibleYears,
        category,
        inStock,
      } = req.body;

      if (!productId || !productName || !slug || !price) {
        return res.status(400).json({
          message: "productId, productName, slug and price are required",
        });
      }

      // Ensure unique productId & slug
      if (await Product.findOne({ productId })) {
        return res.status(400).json({ message: "productId already exists" });
      }
      if (await Product.findOne({ slug })) {
        return res.status(400).json({ message: "slug already exists" });
      }

      const product = await Product.create({
        productId,
        productName,
        slug,
        description,
        price,
        carModel,
        compatibleYears,
        category,
        inStock: inStock !== undefined ? inStock : true,
        imageUrl: req.file?.path || "", // 👈 CLOUDINARY URL
      });

      res.status(201).json(product);
    } catch (err) {
      console.error("Create product error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= UPDATE PRODUCT (OPTIONAL IMAGE) ================= */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // 👈 optional new image
  async (req, res) => {
    try {
      const updates = { ...req.body };

      if (req.file) {
        updates.imageUrl = req.file.path; // 👈 new Cloudinary URL
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
