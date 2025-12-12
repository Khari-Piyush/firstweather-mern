import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "NO_SECRET",
    { expiresIn: "7d" }
  );

/**
 * Register
 * POST /api/auth/register
 * body: { firstName, lastName, email, password, isAdmin? }
 */
router.post("/register", async (req, res) => {
  try {
    console.log(">>> POST /api/auth/register - body:", JSON.stringify(req.body));

    const { firstName, lastName, email, password, isAdmin } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please provide firstName, lastName, email and password" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("Register handler error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Duplicate key", detail: err.keyValue });
    }
    return res.status(500).json({ message: "Server error during registration", error: err.message });
  }
});

/**
 * Login
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    // console.log(">>> POST /api/auth/login - body:", JSON.stringify(req.body));

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login handler error:", err);
    return res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

export default router;
