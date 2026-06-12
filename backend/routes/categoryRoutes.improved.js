import express from "express";
import Category, { SEED_CATEGORIES } from "../models/Category.improved.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

/* GET /api/categories — list all categories ordered for display (public) */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}, "-__v")
      .sort({ order: 1 })
      .lean();
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(categories);
  } catch (err) {
    logger.error({ err }, "list categories error");
    res.status(500).json({ message: "Server error" });
  }
});

/* GET /api/categories/:slug — single category metadata (public) */
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne(
      { slug: req.params.slug },
      "-__v"
    ).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(category);
  } catch (err) {
    logger.error({ err }, "get category error");
    res.status(500).json({ message: "Server error" });
  }
});

/* GET /api/categories/:slug/products — products in category, paginated (public) */
router.get("/:slug/products", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ message: "Category not found" });

    const page  = Math.max(Number(req.query.page)  || 1,  1);
    const limit = Math.min(Number(req.query.limit)  || 12, 20);

    const products = await Product.find(
      { category: category.name, inStock: { $ne: false } },
      "productName price imageUrl slug productId category carModel"
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ category, products, page, limit });
  } catch (err) {
    logger.error({ err }, "get category products error");
    res.status(500).json({ message: "Server error" });
  }
});

/* POST /api/categories/seed — seed the 11 canonical categories (admin only, idempotent) */
router.post("/seed", protect, adminOnly, async (req, res) => {
  try {
    let created = 0;
    let skipped = 0;
    for (const cat of SEED_CATEGORIES) {
      const exists = await Category.findOne({ slug: cat.slug }).lean();
      if (exists) { skipped++; continue; }
      await Category.create(cat);
      created++;
    }
    logger.info({ created, skipped }, "categories seeded");
    res.json({ message: "Seed complete", created, skipped });
  } catch (err) {
    logger.error({ err }, "seed categories error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
