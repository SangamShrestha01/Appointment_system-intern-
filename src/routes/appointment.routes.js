import express from "express";

import { bookAppointment, getDoctorAppointments, getMyAppointments, updateAppointmentStatus } from "../controller/appointment.controller.js";
import { protectedRoutes, restrictTo } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/", protectedRoutes, restrictTo("User"), bookAppointment);

router.get("/my/appointments", protectedRoutes, restrictTo("User"), getMyAppointments);


// Get all appointments for logged-in doctor
router.get("/doctor", protectedRoutes, restrictTo("Doctor"), getDoctorAppointments);

// Update appointment status (Doctor only)
router.patch("/:appointmentId/status", protectedRoutes, restrictTo("Doctor"), updateAppointmentStatus);

export default router;
