import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new enquiry/order from cart
router.post("/", protect, async (req, res) => {
  try {
    const { items, customerName, customerPhone, customerAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!customerName || !customerPhone || !customerAddress) {
      return res.status(400).json({ message: "Customer details are required" });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.price * (item.qty || 1);
    }, 0);

    const order = await Order.create({
      user: req.user.userId,
      items,
      customerName,
      customerPhone,
      customerAddress,
      status: "enquiry",
      totalAmount,
    });

    res.status(201).json({
      message: "Enquiry created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders for current user (or all if admin)
router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    if (!req.user.isAdmin) {
      // Normal user → only their own orders
      query.user = req.user.userId;
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price productId")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order by id (user can see own, admin can see any)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price productId")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If not admin, ensure this is user's own order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get single order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
