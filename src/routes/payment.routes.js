import express from 'express';
import { esewaFailure, esewaSuccess, initiatePayment } from '../controller/payment.controller.js';
const router=express.Router();
router.post('/initial',initiatePayment);
router.get('/esewa/success',esewaSuccess);
router.get('/esewa/failure',esewaFailure);
export default router;