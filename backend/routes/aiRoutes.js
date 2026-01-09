import express from "express";
import upload from "../middleware/upload.js";
import Product from "../models/Product.js";
import getEmbedding from "../utils/getEmbedding.js";
import { cosineSimilarity } from "../utils/cosine.js";

const router = express.Router();

router.post("/search", upload.single("image"), async (req, res) => {
  try {
    const queryEmbedding = await getEmbedding(req.file.path);
    const products = await Product.find({ embedding: { $exists: true } });

    const results = products
      .map((p) => ({
        ...p._doc,
        score: cosineSimilarity(queryEmbedding, p.embedding),
      }))
      .filter((p) => p.score > 0.6)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "AI search failed" });
  }
});

export default router;
