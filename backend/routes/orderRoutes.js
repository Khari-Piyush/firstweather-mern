import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";

const router = express.Router();

// Helper: get user id from several possible shapes
const getUserIdFromReq = (req) => {
  if (!req || !req.user) return null;
  return req.user.userId || req.user._id || req.user.id || null;
};

router.post("/", protect, async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id not found in token" });
    }

    const { items, customerName, customerPhone, customerAddress } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required and must be a non-empty array" });
    }
    if (!customerName || !customerPhone || !customerAddress) {
      return res.status(400).json({ message: "Customer name, phone and address required" });
    }

    // Normalize & validate each item
    const normalizedItems = [];
    for (const [i, raw] of items.entries()) {
      const product = raw.product || raw._id || raw.id || raw.productId || null;
      const name = raw.name || raw.productName || raw.product_name || "";
      const price = Number(raw.price ?? raw.unitPrice ?? NaN);
      const qty = Number(raw.qty ?? raw.quantity ?? NaN);

      if (!product || !name || Number.isNaN(price) || Number.isNaN(qty)) {
        return res.status(400).json({ message: `Item at index ${i} is missing required fields (product, name, price, qty)` });
      }

      if (!mongoose.Types.ObjectId.isValid(product)) {
        return res.status(400).json({ message: `Invalid product id at index ${i}: ${product}` });
      }

      // optional: check product exists
      const prod = await Product.findById(product).select("_id productName price inStock").lean();
      if (!prod) {
        return res.status(404).json({ message: `Product not found for item index ${i}`, product });
      }

      normalizedItems.push({
        product,
        productId: raw.productId || raw.slug || product,
        name,
        price,
        qty,
      });
    }

    // compute total
    const totalAmount = normalizedItems.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);

    // Convert normalizedItems into required shape for the Order model
    const orderItems = normalizedItems.map((it) => ({
      product: it.product,                  // ObjectId of product
      productId: it.productId,              // FW-410
      productName: it.name,                 // ✅ map frontend 'name' → backend 'productName'
      price: it.price,
      qty: it.qty,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      customerName,
      customerPhone,
      customerAddress,
      status: "enquiry",
      totalAmount,
    });


    logger.info({ orderId: order._id, totalAmount }, "order created");
    return res.status(201).json({ message: "Enquiry created successfully", order });
  } catch (err) {
    logger.error({ err }, "create order error");
    return res.status(500).json({ message: "Server error creating order" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    let query = {};
    if (!req.user?.isAdmin) {
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      query.user = userId;
    }

    const orders = await Order.find(query)
      .populate("items.product", "productName price productId")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    logger.error({ err }, "get orders error");
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const order = await Order.findById(req.params.id)
      .populate("items.product", "productName price productId")
      .populate("user", "firstName lastName email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!req.user.isAdmin && order.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (err) {
    logger.error({ err }, "get single order error");
    res.status(500).json({ message: "Server error fetching order" });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const VALID_STATUSES = ["enquiry", "confirmed", "shipped", "delivered", "cancelled"];
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    logger.error({ err }, "update order status error");
    res.status(500).json({ message: "Server error updating order status" });
  }
});


export default router;
