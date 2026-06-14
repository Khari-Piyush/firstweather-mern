import mongoose from "mongoose";

const inquiryItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productCode: {
      type: String,
      default: "",
    },
    productName: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [inquiryItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one item is required",
      },
    },

    customerName: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    customerEmail: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: ["New", "Contacted", "Quotation Sent", "Negotiation", "Confirmed", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
