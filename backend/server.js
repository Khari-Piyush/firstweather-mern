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


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

// DB CONNECT
connectDB();


// MIDDLE-WARE
app.use(express.json());
app.use(
    cors({
		origin:"http://localhost:5173",
		credentials:true,
	})
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);


// Test Route
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});