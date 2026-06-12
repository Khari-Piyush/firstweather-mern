import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    vehicle: { type: String, default: "" },
    source: { type: String, default: "Google" },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 99 },
  },
  { timestamps: true }
);

testimonialSchema.index({ isVisible: 1, order: 1, createdAt: -1 });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
