import express from "express";
import { login, register } from "../controller/user.controller.js";
import { imageUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register",imageUpload, register);
router.post("/login", login);

export default router;
