// SERVER INSTANTIATE
import express from "express";
import dotenv from "dotenv";
// I want my backend to entertain the frontend ki request
import cors from "cors";
import connectDB from "./config/database.js";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import recommendRoute from "./routes/recommend.js"


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();


const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
});

// DB CONNECT
connectDB();
const propertyId = '492464995'; // GA se milega

// MIDDLE-WARE
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://firstweatherwipers.com",
    "https://www.firstweatherwipers.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", enquiryRoutes);
app.use("/api/recommend", recommendRoute)



// Test Route
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

app.get("/", (req, res) => {
  res.send("First Weather Backend Live 🚀");
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch("https://firstweather-backend-url/api/health")
      .then(() => console.log("Server kept alive"))
      .catch(() => {});
  }, 5 * 60 * 1000);
}

app.get('/analytics', async (req, res) => {
  try {
    console.log("🔥 API HIT");

    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
    });

    console.log("✅ RESPONSE:", JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).send("Error fetching analytics");
  }
});

app.get('/analytics-chart', async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.get('/analytics-events', async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/492464995`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });

    console.log("🔥 EVENTS:", JSON.stringify(response.rows, null, 2));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});