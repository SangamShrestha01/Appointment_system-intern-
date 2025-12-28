import express from "express"
import { protectedRoutes, restrictTo } from "../middleware/protectedRoutes.js";
import { createDoctorProfile, deleteDoctor, getDoctorById, getDoctors, updateDoctorProfile } from "../controller/doctor.controller.js";
import { imageUpload } from "../middleware/multer.js";
const router= express.Router();

router.post('/',imageUpload, protectedRoutes, restrictTo("Doctor"),createDoctorProfile);
router.get('/',getDoctors);
router.get('/:id',getDoctorById);
router.patch('/:id',protectedRoutes, restrictTo("Doctor"),updateDoctorProfile);
router.delete('/:id',protectedRoutes, restrictTo("Doctor"),deleteDoctor);
// add admin for delete
    



export default router;
