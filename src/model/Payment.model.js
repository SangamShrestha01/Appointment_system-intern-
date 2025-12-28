
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true,
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        paymentMethod: {
            type: String,
            enum: ["ESewa", "Cash"],
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);