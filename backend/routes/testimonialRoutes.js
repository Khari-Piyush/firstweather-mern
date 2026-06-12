import express from "express";
import Testimonial from "../models/Testimonial.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

/* GET /api/testimonials — visible testimonials, ordered for display (public) */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    const testimonials = await Testimonial.find({ isVisible: true }, "-__v")
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    res.json(testimonials);
  } catch (err) {
    logger.error({ err }, "list testimonials error");
    res.status(500).json({ message: "Server error" });
  }
});

/* GET /api/testimonials/admin — all testimonials including hidden ones (admin only) */
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}, "-__v")
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json(testimonials);
  } catch (err) {
    logger.error({ err }, "list all testimonials error");
    res.status(500).json({ message: "Server error" });
  }
});

/* POST /api/testimonials — create a testimonial (admin only) */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { customerName, rating, text, location, vehicle, source, isVisible, order } = req.body;

    if (!customerName || !rating || !text) {
      return res.status(400).json({ message: "customerName, rating, and text are required" });
    }

    const testimonial = await Testimonial.create({
      customerName,
      rating,
      text,
      location,
      vehicle,
      source,
      isVisible,
      order,
    });

    res.status(201).json(testimonial);
  } catch (err) {
    logger.error({ err }, "create testimonial error");
    res.status(500).json({ message: "Server error" });
  }
});

/* PUT /api/testimonials/:id — update a testimonial (admin only) */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (err) {
    logger.error({ err }, "update testimonial error");
    res.status(500).json({ message: "Server error" });
  }
});

/* DELETE /api/testimonials/:id — delete a testimonial (admin only) */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    logger.error({ err }, "delete testimonial error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
