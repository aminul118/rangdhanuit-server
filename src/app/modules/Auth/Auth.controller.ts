import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { AuthService } from './Auth.service';
import { setAuthCookie } from '../../utils/setCookie';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  setAuthCookie(res, { refreshToken, accessToken });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      user,
    },
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset email sent successfully',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: null,
  });
});

const sendOTP = catchAsync(async (req, res) => {
  await AuthService.sendOTP(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: null,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyOTP(email, otp);
  const { refreshToken, accessToken, user } = result;

  setAuthCookie(res, { refreshToken, accessToken });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email verified successfully',
    data: {
      accessToken,
      user,
    },
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
};
