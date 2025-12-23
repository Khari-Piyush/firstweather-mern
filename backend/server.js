// SERVER INSTANTIATE
import express from "express";
import dotenv from "dotenv";
// I want my backend to entertain the frontend ki request
import cors from "cors";
import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

// DB CONNECT
connectDB();


// MIDDLE-WARE
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local dev
      "https://firstweather.vercel.app"    // vercel frontend
    ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", enquiryRoutes);


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