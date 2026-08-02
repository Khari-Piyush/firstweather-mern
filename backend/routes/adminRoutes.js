import express from "express";
import Product from "../models/Product.js";
import Inquiry from "../models/Inquiry.improved.js";
import Enquiry from "../models/Enquiry.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();

    res.json({
      totalProducts,
      totalInquiries,
      totalEnquiries,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

export default router;
