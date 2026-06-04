import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const AUTH_COOKIE = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const CSRF_COOKIE = {
  httpOnly: false,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const generateToken = (user) =>
  jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const setAuthCookies = (res, token) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("auth_token", token, AUTH_COOKIE);
  res.cookie("csrf_token", csrfToken, CSRF_COOKIE);
};

/**
 * Register
 * POST /api/auth/register
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
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, isAdmin: !!isAdmin });

    const token = generateToken(user);
    setAuthCookies(res, token);

    const userPayload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: userPayload,
    });
  } catch (err) {
    console.error("Register handler error:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Duplicate key", detail: err.keyValue });
    }
    return res.status(500).json({ message: "Server error during registration" });
  }
});

/**
 * Login
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email })
      .select("_id firstName lastName email password isAdmin")
      .lean();

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    setAuthCookies(res, token);

    return res.json({
      message: "Login successful",
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
    return res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", { ...AUTH_COOKIE, maxAge: 0 });
  res.clearCookie("csrf_token", { ...CSRF_COOKIE, maxAge: 0 });
  res.json({ message: "Logged out" });
});

export default router;
