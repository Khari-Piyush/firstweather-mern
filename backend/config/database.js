import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    const start = Date.now();

    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info({ ms: Date.now() - start }, "MongoDB connected");

    await mongoose.connection.db.command({ ping: 1 });
    logger.info("MongoDB pinged & warmed");

    await mongoose.connection.syncIndexes();
    logger.info("MongoDB indexes synced");

  } catch (error) {
    logger.error({ err: error }, "DB connection failed");
    throw error;
  }
};

export default connectDB;
