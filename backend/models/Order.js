import mongoose from "mongoose";

const orderScheme = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                productId: {
                    type: String,
                    required: true,
                },
                
                productName: {
                    type: string,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },

                qty: {
                    type: Number,
                    default: 1,
                },
            },
        ],

        status: {
            type: String,
            default: "enquiry", // enquiry | confirmed | shipped | delivered | cancelled
        },
        customerName: {
            type:String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },

        customerAddress: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            deafult: 0,
        },
    },
    {timestamps: true}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;