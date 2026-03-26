import express from 'express';
import { AuthController } from './Auth.controller';

const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/send-otp', AuthController.sendOTP);
router.post('/verify-otp', AuthController.verifyOTP);

export const AuthRoutes = router;
