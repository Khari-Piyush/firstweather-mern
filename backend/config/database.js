import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const start = Date.now();

    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(
      `MongoDB Connected Successfully (${Date.now() - start}ms)`
    );

    // DB warm-up
    await mongoose.connection.db.command({ ping: 1 });
    console.log("MongoDB pinged & warmed");

    await mongoose.connection.syncIndexes();
    console.log("MongoDB indexes synced");

  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
