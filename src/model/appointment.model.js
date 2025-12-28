import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Patient is required"],
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References User with role: "Doctor"
            required: [true, "Doctor is required"],
        },
        date: {
            type: String, // Format: "2025-12-25"
            required: [true, "Date is required"],
        },
        time: {
            type: String, // Format: "10:00"
            required: [true, "Time slot is required"],
        },
        appointmentDateTime: {
            type: Date, // Full datetime for queries/sorting (e.g., new Date("2025-12-25T10:00:00"))
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Cancelled", "Completed"],
            default: "Pending",
        },
        reason: {
            type: String,
            maxlength: 500,
            trim: true,
        },
        notes: {
            type: String,
            default: "",
        },
        fees: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent double booking: same doctor + same exact datetime
appointmentSchema.index({ doctor: 1, appointmentDateTime: 1 }, { unique: true });

// Optional: Index for faster queries
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);