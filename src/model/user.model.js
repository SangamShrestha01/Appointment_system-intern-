import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },

        address: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ["Admin", "User","Doctor"],
            default: "User",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);