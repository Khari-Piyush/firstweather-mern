// backend/routes/orderRoutes.js
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const safeLog = (label, obj) => {
  try {
    console.log(label, JSON.stringify(obj, (k, v) => (k === "stack" ? undefined : v)));
  } catch (e) {
    console.log(label, obj);
  }
};

// Helper: get user id from several possible shapes
const getUserIdFromReq = (req) => {
  if (!req || !req.user) return null;
  return req.user.userId || req.user._id || req.user.id || null;
};

router.post("/", protect, async (req, res) => {
  try {
    safeLog(">>> /api/orders - req.user", req.user);
    safeLog(">>> /api/orders - body", req.body);

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


    safeLog("Order created:", { id: order._id, totalAmount });
    return res.status(201).json({ message: "Enquiry created successfully", order });
  } catch (err) {
    console.error("Create order error (stack):", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Server error creating order", error: err.message });
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
    console.error("Get orders error (stack):", err && err.stack ? err.stack : err);
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
    console.error("Get single order error (stack):", err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Server error fetching order" });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});


export default router;
