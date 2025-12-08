import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly} from "../middleware/authMiddleware.js";

const router = express.Router();

// products get karne ke liye
router.get("/", async(req, res) => {
  try{
    const products = await Product.find().sort({ createdAt: -1});
    res.json(products);
  }catch(err) {
    console.error("Get Products Error: ", err);
    res.status(500).json({ message: "Server Error"});
  }
});


// product ko id se get krne ke liye
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


// new product bnane ke liye
router.post("/", protect, adminOnly, async (req, res) => {
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
      imageUrl,
      inStock,
    } = req.body;

    if (!productId || !productName || !slug || !price) {
      return res.status(400).json({
        message: "productId, productName, slug and price are required",
      });
    }

    // Ensure unique slug or productId
    const existingById = await Product.findOne({ productId });
    if (existingById) {
      return res.status(400).json({ message: "productId already exists" });
    }

    const existingBySlug = await Product.findOne({ slug });
    if (existingBySlug) {
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
      imageUrl,
      inStock: inStock !== undefined ? inStock : true,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Product
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true } // return updated doc
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete a product
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
