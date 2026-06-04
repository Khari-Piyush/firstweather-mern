import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

const ML_URL = process.env.ML_URL || "https://firstweather-ml.onrender.com";
const ML_SECRET = process.env.ML_SECRET || "";

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${ML_URL}/recommend/${id}`, {
      timeout: 20000,
      headers: ML_SECRET ? { "X-ML-Secret": ML_SECRET } : {},
    });

    const recommendedIds = response.data;
    console.log("ML response for", id, "→", JSON.stringify(recommendedIds));

    if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
      return res.json([]);
    }

    const objectIds = recommendedIds
      .filter((rid) => mongoose.Types.ObjectId.isValid(rid))
      .map((rid) => new mongoose.Types.ObjectId(rid));

    if (!objectIds.length) {
      return res.json([]);
    }

    const products = await Product.find({ _id: { $in: objectIds } }).lean();
    res.json(products);

  } catch (err) {
    const status = err.response?.status;
    const data   = err.response?.data;
    console.error(`Recommend route error [${status || err.code}]:`, err.message, data || "");
    res.json([]);
  }
});

export default router;
