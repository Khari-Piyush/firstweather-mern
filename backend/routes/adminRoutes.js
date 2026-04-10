import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "enquiry" });

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

export default router;
