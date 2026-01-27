import mongoose from "mongoose";

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
            unique: true,   // so no duplicate product IDs
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
            type: String
        },
        compatibleYears: [{ type: Number }],

        category: { type: String },
        imageUrl: {
            type: String,
            required: true,
        },
        videoUrl: { type: String },

        inStock: {
            type: Boolean,
            default: true,
        },
        embedding: {
            type: [Number],
            default: [],
        },
    },
    { timestamps: true }
    
);

const Product = mongoose.model("Product", productSchema);
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ inStock: 1 });


export default Product;