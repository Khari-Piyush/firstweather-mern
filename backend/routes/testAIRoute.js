import express from "express";
import upload from "../middleware/upload.js";
import getEmbedding from "../utils/getEmbedding.js";

const router = express.Router();

router.post("/test-ai", upload.single("image"), async (req, res) => {
  try {
    const embedding = await getEmbedding(req.file.path);
    res.json({
      message: "Node → Python AI working",
      embeddingLength: embedding.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI test failed" });
  }
});

export default router;
