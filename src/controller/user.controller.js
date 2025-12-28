import { User } from "../model/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { generateToken } from "../utils/generareToken.js";
import bcryptjs from "bcryptjs"

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, address, confirmPassword,role } = req.body;

  // Check all fields
  if (!name || !email || !password || !confirmPassword || !address || !role) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, "User already exists"));
  }

  // Check password match
  if (password !== confirmPassword) {
    return next(new ApiError(400, "Password does not match"));
  }
  const hashedPassword=await  bcryptjs.hash(password,10);


  let imageUrl;
    if (req.file) {
        try {
            const fileUrl = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUrl.content);
            console.log(cloudResponse);
            imageUrl = cloudResponse.secure_url
        } catch (err) {
            console.log(err.message);
            return next(new ApiError(500, "Failed to upload image"))

        }
    }
    
  // Create user
  const newUser = await User.create({
    name,
    email,
    password:hashedPassword,
    address,
    image:imageUrl,
    role

  });
  const token= generateToken({id:newUser._id,email:newUser.email,role:newUser.role})

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
    token
  });
});


export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return next(new ApiError(400, "User does not exist"));
  }
  console.log(existingUser);

  // Check if password matches
  const matchPassword = await bcryptjs.compare(password, existingUser.password);
  if (!matchPassword) {
    return next(new ApiError(400, "Password did not match"));
  }

  // Generate token
  const token = generateToken({ id: existingUser._id, email: existingUser.email,role:existingUser.role });

  // Send response
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    data: {
      existingUser,
      token
    }
  });
});

