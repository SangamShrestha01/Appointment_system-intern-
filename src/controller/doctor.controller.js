import { User } from "../model/user.model.js";
import { DoctorProfile } from "../model/doctor.model.js";
import ApiError from "../utils/apiError.js";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

// ------------------------------
// Create Doctor Profile
// ------------------------------
export const createDoctorProfile = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || currentUser.role.toLowerCase() !== "doctor") {
        return next(new ApiError(403, "Only doctors can create a profile"));
    }

    const { speciality, degree, experience, fees, address, availability } = req.body;

    if (!speciality || !degree || !experience || !fees || !address || !availability) {
        return next(new ApiError(400, "All required fields must be provided"));
    }

    const existingProfile = await DoctorProfile.findOne({ user: currentUser._id });
    if (existingProfile) {
        return next(new ApiError(400, "Doctor profile already exists"));
    }

    let imageUrl = currentUser.image || null;

    if (req.file) {
        const fileUri = getDataUri(req.file);
        const result = await cloudinary.uploader.upload(fileUri.content);
        imageUrl = result.secure_url;
    }

    const doctorProfile = await DoctorProfile.create({
        user: currentUser._id,
        speciality,
        degree,
        experience,
        fees,
        address,
        availability,
        image: imageUrl,
    });

    await User.findByIdAndUpdate(currentUser._id, {
        doctorProfile: doctorProfile._id,
        image: imageUrl,
    });

    res.status(201).json({
        success: true,
        message: "Doctor profile created successfully",
        data: doctorProfile,
    });
});

// ------------------------------
// Get All Doctors
// ------------------------------
export const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await DoctorProfile.find()
        .populate("user", "name email image")
        .select("-__v");

    res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
    });
});

// ------------------------------
// Get Doctor by ID
// ------------------------------
export const getDoctorById = asyncHandler(async (req, res, next) => {
    const doctor = await DoctorProfile.findById(req.params.id)
        .populate("user", "-password");

    if (!doctor) {
        return next(new ApiError(404, "Doctor not found"));
    }

    res.status(200).json({
        success: true,
        data: doctor,
    });
});

// ------------------------------
// Update Doctor Profile
// ------------------------------
export const updateDoctorProfile = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || currentUser.role.toLowerCase() !== "doctor") {
        return next(new ApiError(403, "Access denied"));
    }

    const profile = await DoctorProfile.findOne({
        _id: req.params.id,
        user: currentUser._id,
    });

    if (!profile) {
        return next(new ApiError(404, "Profile not found"));
    }

    const { speciality, degree, experience, fees, address, availability } = req.body;

    if (speciality) profile.speciality = speciality;
    if (degree) profile.degree = degree;
    if (experience !== undefined) profile.experience = experience;
    if (fees) profile.fees = fees;
    if (address) profile.address = { ...profile.address, ...address };
    if (availability) profile.availability = availability;

    if (req.file) {
        const fileUri = getDataUri(req.file);
        const result = await cloudinary.uploader.upload(fileUri.content);
        profile.image = result.secure_url;

        await User.findByIdAndUpdate(currentUser._id, {
            image: result.secure_url,
        });
    }

    await profile.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
    });
});

// ------------------------------
// Delete Doctor (Admin only)
// ------------------------------
export const deleteDoctor = asyncHandler(async (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || currentUser.role.toLowerCase() !== "admin") {
        return next(new ApiError(403, "Only admin can delete doctors"));
    }

    const doctorProfile = await DoctorProfile.findById(req.params.id);
    if (!doctorProfile) {
        return next(new ApiError(404, "Doctor not found"));
    }

    await DoctorProfile.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(doctorProfile.user, {
        role: "patient",
        doctorProfile: null,
    });

    res.status(200).json({
        success: true,
        message: "Doctor removed successfully",
    });
});
