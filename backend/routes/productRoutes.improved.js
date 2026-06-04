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
const productsCache = new Map();
const MAX_SEARCH_LEN = 100;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 20);
    const { category, vehicle } = req.query;

    const normalizedVehicle = vehicle?.trim().toLowerCase();

    const cacheKey = `p:${page}:l:${limit}:c:${category || "all"}:v:${normalizedVehicle || "all"}`;


    // ⚡ CACHE HIT
    if (productsCache.has(cacheKey)) {
      return res.json(productsCache.get(cacheKey));
    }

    const safeCat = category ? escapeRegex(category.slice(0, MAX_SEARCH_LEN)) : null;
    const safeVehicle = vehicle ? escapeRegex(vehicle.trim().slice(0, MAX_SEARCH_LEN)) : null;

    const filter = {
      inStock: true,

      ...(safeCat && safeCat !== "All"
        ? { category: { $regex: `^${safeCat}$`, $options: "i" } }
        : {}),
    };

    if (safeVehicle) {
      filter.$or = [
        { carModel: { $regex: `^${safeVehicle}$`, $options: "i" } },
        { productName: { $regex: safeVehicle, $options: "i" } },
      ];
    }



    const products = await Product.find(
      filter,
      "productName price imageUrl slug productId category"
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    productsCache.set(cacheKey, products);

    // ⏱ auto clear cache after 60 sec
    setTimeout(() => productsCache.delete(cacheKey), 60000);

    res.json(products);
  } catch (err) {
    console.error(err);
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

    res.json(product);
  } catch (err) {
    console.error("Get product by ID error:", err);
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
      console.log("✅ ROUTE HIT");
      console.log("FILES:", req.files);

      if (!req.files?.csv || !req.files?.zip) {
        return res.status(400).json({ message: "CSV and ZIP both required" });
      }

      const csvFile = req.files.csv[0];
      const zipFile = req.files.zip[0];
      uploadedPaths.push(csvFile.path, zipFile.path);

      console.log("CSV PATH:", csvFile?.path);

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
      console.log("CSV DATA:", products);
      const finalProducts = [];

      for (let p of products) {
        if (!p.image) {
          console.warn("Missing image column for:", p);
          continue;
        }

        // Validate CSV image path stays inside extractPath
        const imagePath = path.resolve(extractPath, p.image);
        if (!imagePath.startsWith(resolvedExtract + path.sep)) {
          console.warn(`Rejected unsafe image path: ${p.image}`);
          continue;
        }

        const rawPrice = String(p.price || "").replace(/[^\d.]/g, "");
        const price = Number(rawPrice);

        if (isNaN(price)) {
          console.warn("Invalid price, skipping:", p.productName, p.price);
          continue;
        }

        if (!fs.existsSync(imagePath)) {
          console.warn(`Image not found for ${p.productName}`);
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
      console.error("Bulk upload error:", err);
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
