import express from "express";
import Enquiry from "../models/Enquiry.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import logger from "../config/logger.js";
import { sendEnquiryNotificationEmail } from "../utils/inquiryNotifications.improved.js";

const router = express.Router();

/* CREATE — public, rate-limited (see server.js) */
router.post("/enquiry", async (req, res) => {
  logger.info("enquiry request received");

  const { name, phone, email, message } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }
  if (!phone || !String(phone).trim()) {
    return res.status(400).json({ success: false, message: "Phone is required" });
  }

  logger.info("enquiry validation passed");

  let enquiry;
  try {
    enquiry = await Enquiry.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      message: message ? String(message).trim() : undefined,
    });
    logger.info({ enquiryId: enquiry._id }, "enquiry saved to MongoDB");
  } catch (err) {
    logger.error({ err }, "enquiry save error");
    return res.status(500).json({ success: false, message: "Failed to submit enquiry" });
  }

  // Respond as soon as the enquiry is safely in MongoDB. Email delivery
  // happens after this and must never turn an already-saved enquiry into
  // a failed submission for the customer.
  res.status(200).json({
    success: true,
    message: "Enquiry sent successfully",
  });
  logger.info({ enquiryId: enquiry._id }, "enquiry response sent");

  sendEnquiryNotificationEmail(enquiry).catch((err) =>
    logger.error({ err, enquiryId: enquiry._id }, "enquiry email failed")
  );
});

/* LIST — admin only */
router.get("/enquiry", protect, adminOnly, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    logger.error({ err }, "list enquiries error");
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});

export default router;
