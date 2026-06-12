import mongoose from "mongoose";
import { CATEGORY_NAMES } from "./Category.improved.js";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    carModel: {
      type: String,
    },
    compatibleYears: [{ type: Number }],

    category: {
      type: String,
      enum: {
        values: CATEGORY_NAMES,
        message: '"{VALUE}" is not a valid category — see GET /api/categories for the list',
      },
    },

    imageUrl: {
      type: String,
      required: true,
    },
    videoUrl: { type: String },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ inStock: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
