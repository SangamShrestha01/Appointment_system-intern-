import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { User } from "../model/user.model.js";

export const protectedRoutes = asyncHandler(async (req, res, next) => {
    // 1️⃣ Get token from headers
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError(401, "Not authorized, token missing"));
    }

    // 2️⃣ Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECERT); 
    } catch (err) {
        return next(new ApiError(401, "Token is invalid or expired"));
    }

    console.log(decoded)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
});


export const restrictTo = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next(); // user is authorized
  };
};
