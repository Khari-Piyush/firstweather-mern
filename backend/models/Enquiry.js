import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
