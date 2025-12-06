import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("MONGO_URI from env ->", JSON.stringify(process.env.MONGO_URI));
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are optional in newer mongoose but safe:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
