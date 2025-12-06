// SERVER INSTANTIATE
import express from "express";
import dotenv from "dotenv";
// I want my backend to entertain the frontend ki request
import cors from "cors";
import connectDB from "./config/database.js";


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

// DB CONNECT
connectDB();


// MIDDLE-WARE
app.use(express.json());
app.use(
    cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
);

// Test Route
app.get("/api/health", (req, res) => {
  res.json({ message: "OK" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});