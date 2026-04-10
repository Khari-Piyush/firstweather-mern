import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://firstweather-ml.onrender.com/recommend/${id}`
    );

    const recommendedIds = response.data;

    // 🔥 FIX HERE
    const objectIds = recommendedIds.map(
      id => new mongoose.Types.ObjectId(id)
    );

    const products = await Product.find({
      _id: { $in: objectIds  }
    });

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;