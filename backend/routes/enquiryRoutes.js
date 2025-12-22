import express from "express";
import nodemailer from "nodemailer";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

router.post("/enquiry", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // 1️⃣ Save to MongoDB
    await Enquiry.create({
      name,
      phone,
      email,
      message,
    });

    // 2️⃣ Send Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"First Weather Enquiry" <${process.env.MAIL_USER}>`,
      to: "firstweather16@gmail.com",
      subject: "📩 New Website Enquiry",
      html: `
        <h2>New Enquiry Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email || "N/A"}</p>
        <p><b>Message:</b> ${message || "N/A"}</p>
        <p><b>Time:</b> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Enquiry sent successfully",
    });
  } catch (error) {
    console.error("Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
});

/* GET ALL ENQUIRIES */
router.get("/enquiries", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enquiries" });
  }
});


export default router;
