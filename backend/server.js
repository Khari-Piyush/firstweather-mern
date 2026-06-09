// SERVER INSTANTIATE
import express from "express";
import dotenv from "dotenv";
// I want my backend to entertain the frontend ki request
import cors from "cors";
import connectDB from "./config/database.js";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import helmet from "helmet";
import logger from "./config/logger.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.improved.js";
import productRoutes from "./routes/productRoutes.improved.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import recommendRoute from "./routes/recommend.js"


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many enquiries submitted, please try again later" },
});


let analyticsDataClient = null;
try {
  analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  });
} catch (e) {
  logger.warn({ err: e.message }, "analytics client init failed — routes unavailable");
}

const propertyId = '492464995'; // GA se milega

// MIDDLE-WARE
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:5173"];

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
}));


app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enquiry", enquiryLimiter);
app.use("/api", enquiryRoutes);
app.use("/api/recommend", recommendRoute)



// Health check — must respond before DB is ready so Render doesn't time out
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

app.get("/", (req, res) => {
  res.send("First Weather Backend Live 🚀");
});


// Start Server FIRST, then connect DB (so health check responds immediately)
app.listen(PORT, () => {
  logger.info({ port: PORT }, "server started");

  // DB CONNECT — after server is listening
  connectDB().catch((err) => {
    logger.error({ err: err.message }, "DB connection failed on startup");
  });
});

if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch("https://first-weather-webapp-h05a.onrender.com/api/health")
      .catch((err) => logger.warn({ err: err.message }, "keep-alive ping failed"));
  }, 5 * 60 * 1000);
}

app.get('/analytics', async (req, res) => {
  if (!analyticsDataClient) return res.status(503).json({ message: "Analytics unavailable" });
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
    });
    res.json(response);
  } catch (error) {
    logger.error({ err: error.message }, "analytics page-views error");
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

app.get('/analytics-chart', async (req, res) => {
  if (!analyticsDataClient) return res.status(503).json({ message: "Analytics unavailable" });
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
    });
    res.json(response);
  } catch (error) {
    logger.error({ err: error.message }, "analytics chart error");
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

app.get('/analytics-events', async (req, res) => {
  if (!analyticsDataClient) return res.status(503).json({ message: "Analytics unavailable" });
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });
    res.json(response);
  } catch (error) {
    logger.error({ err: error.message }, "analytics events error");
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Global error handler — must be last, after all routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error({ err, method: req.method, url: req.originalUrl }, "unhandled error");
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ message: "An unexpected error occurred" });
});