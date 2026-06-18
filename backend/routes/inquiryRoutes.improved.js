import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import Inquiry from "../models/Inquiry.improved.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";
import { generateInquiryPdfBuffer } from "../utils/inquiryPdf.improved.js";
import { saveInquiryPdfFile, inquiryPdfFilePath } from "../utils/storeInquiryPdf.improved.js";
import {
  sendAdminInquiryEmail,
  sendCustomerConfirmationEmail,
  buildInquiryWhatsappUrl,
} from "../utils/inquiryNotifications.improved.js";

const router = express.Router();

const STATUS_VALUES = Inquiry.schema.path("status").enumValues;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many inquiries submitted, please try again later" },
});

// FW-YYYYMMDD-XXXX, sequential per day with collision retry
const generateInquiryId = async () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const countToday = await Inquiry.countDocuments({ createdAt: { $gte: start, $lt: end } });

  for (let attempt = 0; attempt < 10; attempt++) {
    const seq = countToday + 1 + attempt;
    const id = `FW-${datePart}-${String(seq).padStart(4, "0")}`;
    // eslint-disable-next-line no-await-in-loop
    if (!(await Inquiry.exists({ inquiryId: id }))) return id;
  }
  return `FW-${datePart}-${Date.now().toString().slice(-4)}`;
};

/* CREATE — public, rate-limited */
router.post("/", submitLimiter, async (req, res) => {
  try {
    const { customer = {}, items, notes } = req.body || {};
    const { name, company, email, phone, city, country } = customer;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ message: "A valid email is required" });
    }
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ message: "Phone is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    const productIds = [];
    for (const [i, raw] of items.entries()) {
      const id = raw?.productId;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid product reference at item ${i + 1}` });
      }
      productIds.push(id);
    }

    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id productName productId")
      .lean();
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const normalizedItems = [];
    for (const [i, raw] of items.entries()) {
      const product = productMap.get(String(raw.productId));
      if (!product) {
        return res.status(404).json({ message: `Product not found for item ${i + 1}` });
      }
      normalizedItems.push({
        product: product._id,
        productCode: product.productId || "",
        productName: product.productName,
        qty: Math.max(1, Number(raw.qty) || 1),
      });
    }

    const inquiryId = await generateInquiryId();

    const inquiry = await Inquiry.create({
      inquiryId,
      items: normalizedItems,
      customerName: String(name).trim(),
      company: company ? String(company).trim() : "",
      customerEmail: String(email).trim(),
      customerPhone: String(phone).trim(),
      city: city ? String(city).trim() : "",
      country: country ? String(country).trim() : "",
      notes: notes ? String(notes).trim() : "",
    });

    logger.info({ inquiryId: inquiry.inquiryId }, "inquiry created");

    // PDF generation is best-effort — a failure here must not lose the
    // inquiry that's already saved.
    let pdfBuffer = null;
    try {
      pdfBuffer = await generateInquiryPdfBuffer(inquiry);
      saveInquiryPdfFile(pdfBuffer, inquiry.inquiryId);
      inquiry.pdfUrl = `${req.protocol}://${req.get("host")}/api/inquiries/pdf/${inquiry.inquiryId}`;
      await inquiry.save();
    } catch (pdfErr) {
      logger.error({ err: pdfErr, inquiryId: inquiry.inquiryId }, "inquiry pdf generation error");
    }

    // Respond immediately — the user must never wait on email delivery.
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: inquiry.inquiryId,
      whatsappUrl: buildInquiryWhatsappUrl(inquiry),
    });

    // Notifications are fire-and-forget, sent after the response. Failures
    // must not lose the inquiry — they're just logged. No PII in logs,
    // only the inquiryId.
    sendAdminInquiryEmail(inquiry, pdfBuffer).catch((mailErr) => {
      logger.error({ err: mailErr, inquiryId: inquiry.inquiryId }, "admin notification email error");
    });

    sendCustomerConfirmationEmail(inquiry).catch((mailErr) => {
      logger.error({ err: mailErr, inquiryId: inquiry.inquiryId }, "customer confirmation email error");
    });
  } catch (err) {
    logger.error({ err }, "create inquiry error");
    res.status(500).json({ message: "Failed to submit inquiry" });
  }
});

/* PDF — public (link shared with the customer who submitted the inquiry) */
router.get("/pdf/:inquiryId", (req, res) => {
  const { inquiryId } = req.params;
  if (!/^FW-\d{8}-\d{4}$/.test(inquiryId)) {
    return res.status(400).json({ message: "Invalid inquiry id" });
  }

  const filePath = inquiryPdfFilePath(inquiryId);
  res.sendFile(filePath, {
    headers: { "Content-Type": "application/pdf" },
  }, (err) => {
    if (err) {
      if (!res.headersSent) res.status(404).json({ message: "PDF not found" });
    }
  });
});

/* LIST — admin only */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    logger.error({ err }, "list inquiries error");
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
});

/* ANALYTICS — admin only. Single aggregation, no N+1 queries. */
router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [result] = await Inquiry.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          monthlyCounts: [
            { $match: { createdAt: { $gte: startOfLastMonth } } },
            {
              $group: {
                _id: { $gte: ["$createdAt", startOfThisMonth] },
                count: { $sum: 1 },
              },
            },
          ],
          topProducts: [
            { $unwind: "$items" },
            {
              $group: {
                _id: { productCode: "$items.productCode", productName: "$items.productName" },
                totalQty: { $sum: "$items.qty" },
                inquiryCount: { $sum: 1 },
              },
            },
            { $sort: { totalQty: -1 } },
            { $limit: 5 },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                inquiryId: 1,
                customerName: 1,
                status: 1,
                createdAt: 1,
                itemCount: { $size: "$items" },
              },
            },
          ],
        },
      },
    ]);

    const totalInquiries = result.total[0]?.count || 0;

    const statusSummary = {};
    for (const s of STATUS_VALUES) statusSummary[s] = 0;
    for (const row of result.statusCounts) {
      if (statusSummary[row._id] !== undefined) statusSummary[row._id] = row.count;
    }

    let current = 0;
    let previous = 0;
    for (const row of result.monthlyCounts) {
      if (row._id === true) current = row.count;
      else previous = row.count;
    }
    const trend = previous === 0 ? (current === 0 ? 0 : null) : Math.round(((current - previous) / previous) * 100);

    const mostRequestedProducts = result.topProducts.map((p) => ({
      productCode: p._id.productCode,
      productName: p._id.productName,
      totalQty: p.totalQty,
      inquiryCount: p.inquiryCount,
    }));

    res.json({
      totalInquiries,
      statusSummary,
      monthly: { current, previous, trend },
      mostRequestedProducts,
      recentInquiries: result.recent,
    });
  } catch (err) {
    logger.error({ err }, "inquiry analytics error");
    res.status(500).json({ message: "Failed to fetch inquiry analytics" });
  }
});

/* DETAIL — admin only */
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    logger.error({ err }, "get inquiry error");
    res.status(500).json({ message: "Failed to fetch inquiry" });
  }
});

/* UPDATE STATUS — admin only */
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    const { status } = req.body || {};
    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(", ")}` });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    logger.info({ inquiryId: inquiry.inquiryId, status }, "inquiry status updated");
    res.json(inquiry);
  } catch (err) {
    logger.error({ err }, "update inquiry status error");
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* ADD INTERNAL NOTE — admin only, append-only */
router.post("/:id/notes", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    const { text } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $push: { internalNotes: { text: String(text).trim(), createdAt: new Date() } } },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    res.json(inquiry);
  } catch (err) {
    logger.error({ err }, "add inquiry note error");
    res.status(500).json({ message: "Failed to add note" });
  }
});

export default router;
