import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // multer LOCAL
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import csv from "csvtojson";
import unzipper from "unzipper";
import path from "path";
import logger from "../config/logger.js";


const router = express.Router();
const MAX_SEARCH_LEN = 100;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

// Extracts the 11-char video id from watch/youtu.be/shorts (and embed) URL forms; null if not YouTube.
const extractYouTubeId = (url) => {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
    }
    const shortsMatch = u.pathname.match(/^\/shorts\/([^/]+)/);
    if (shortsMatch) return YOUTUBE_ID_REGEX.test(shortsMatch[1]) ? shortsMatch[1] : null;

    const embedMatch = u.pathname.match(/^\/embed\/([^/]+)/);
    if (embedMatch) return YOUTUBE_ID_REGEX.test(embedMatch[1]) ? embedMatch[1] : null;
  }

  return null;
};


/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 20);
    const { category, vehicle } = req.query;

    const safeCat = category ? escapeRegex(category.slice(0, MAX_SEARCH_LEN)) : null;
    const safeVehicle = vehicle ? escapeRegex(vehicle.trim().slice(0, MAX_SEARCH_LEN)) : null;

    const filter = { inStock: { $ne: false } };

    if (safeCat && safeCat !== "All") {
      filter.category = { $regex: `^${safeCat}$`, $options: "i" };
    }

    if (safeVehicle) {
      filter.$or = [
        { carModel: { $regex: `^${safeVehicle}$`, $options: "i" } },
        { productName: { $regex: safeVehicle, $options: "i" } },
      ];
    }

    const products = await Product.find(
      filter,
      "productName price imageUrl slug productId category videoUrl"
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(products);
  } catch (err) {
    logger.error({ err }, "get products error");
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(product);
  } catch (err) {
    logger.error({ err }, "get product by id error");
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= BULK UPLOAD WITH IMAGES ================= */
router.post(
  "/bulk-upload-with-images",
  protect,
  adminOnly,
  upload.fields([
    { name: "csv", maxCount: 1 },
    { name: "zip", maxCount: 1 },
  ]),
  async (req, res) => {
    const extractPath = `uploads/extracted-${Date.now()}`;
    const uploadedPaths = [];

    try {
      if (!req.files?.csv || !req.files?.zip) {
        return res.status(400).json({ message: "CSV and ZIP both required" });
      }

      const csvFile = req.files.csv[0];
      const zipFile = req.files.zip[0];
      uploadedPaths.push(csvFile.path, zipFile.path);

      fs.mkdirSync(extractPath, { recursive: true });
      const resolvedExtract = path.resolve(extractPath);

      // Zip-Slip guard: validate every entry path before writing to disk
      const directory = await unzipper.Open.file(zipFile.path);

      if (directory.files.length > 500) {
        return res.status(400).json({ message: "ZIP exceeds 500-entry limit" });
      }

      for (const file of directory.files) {
        const dest = path.resolve(extractPath, file.path);
        if (!dest.startsWith(resolvedExtract + path.sep) && dest !== resolvedExtract) {
          return res.status(400).json({ message: "Rejected: unsafe path in ZIP" });
        }
        if (file.type === "Directory") {
          fs.mkdirSync(dest, { recursive: true });
        } else {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          await new Promise((resolve, reject) => {
            file.stream().pipe(fs.createWriteStream(dest))
              .on("finish", resolve)
              .on("error", reject);
          });
        }
      }

      const products = await csv().fromFile(csvFile.path);
      const finalProducts = [];

      for (let p of products) {
        if (!p.image) {
          logger.warn({ row: p.productName }, "bulk upload: missing image column");
          continue;
        }

        // Validate CSV image path stays inside extractPath
        const imagePath = path.resolve(extractPath, p.image);
        if (!imagePath.startsWith(resolvedExtract + path.sep)) {
          logger.warn({ imagePath: p.image }, "bulk upload: rejected unsafe image path");
          continue;
        }

        const rawPrice = String(p.price || "").replace(/[^\d.]/g, "");
        const price = Number(rawPrice);

        if (isNaN(price)) {
          logger.warn({ productName: p.productName, price: p.price }, "bulk upload: invalid price, skipping");
          continue;
        }

        if (!fs.existsSync(imagePath)) {
          logger.warn({ productName: p.productName }, "bulk upload: image file not found");
          continue;
        }

        const uploadRes = await cloudinary.uploader.upload(imagePath, {
          folder: "fwproducts",
        });

        finalProducts.push({
          productName: p.productName,
          productId: p.productId,
          slug: p.slug,
          description: p.description,
          price,
          category: p.category,
          carModel: p.carModel,
          imageUrl: uploadRes.secure_url,
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
      logger.error({ err }, "bulk upload error");
      res.status(500).json({ message: "Server error" });
    } finally {
      // Clean up temp files and extracted directory on every exit path
      uploadedPaths.forEach((p) => { try { fs.unlinkSync(p); } catch (_) {} });
      if (fs.existsSync(extractPath)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
      }
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
        videoUrl,
      } = req.body;


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

      const trimmedVideoUrl = (videoUrl || "").trim();
      if (trimmedVideoUrl && !extractYouTubeId(trimmedVideoUrl)) {
        return res.status(400).json({
          message: "videoUrl must be a valid YouTube watch, youtu.be, or shorts link",
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
        if (err) logger.warn({ err: err.message }, "temp file delete warning");
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
        videoUrl: trimmedVideoUrl,
      });

      res.status(201).json(product);
    } catch (err) {
      logger.error({ err }, "create product error");
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

      if (updates.videoUrl !== undefined) {
        const trimmedVideoUrl = updates.videoUrl.trim();
        if (trimmedVideoUrl && !extractYouTubeId(trimmedVideoUrl)) {
          return res.status(400).json({
            message: "videoUrl must be a valid YouTube watch, youtu.be, or shorts link",
          });
        }
        updates.videoUrl = trimmedVideoUrl;
      }

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
      logger.error({ err }, "update product error");
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
    logger.error({ err }, "delete product error");
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
