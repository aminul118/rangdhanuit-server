import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { UserService } from './User.service';
import { clearCache } from '@middleware/cacheMiddleware';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUserService(req.body);

  // Clear cache for users
  await clearCache('users');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role: decodedRole } = req.user as JwtPayload;
  const result = await UserService.getMe(email);

  // Detect if role has changed since token was issued
  const isRoleChanged = result && result.role !== decodedRole;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: {
      ...result?.toObject(),
      roleChanged: isRoleChanged,
    },
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const { data, meta } = await UserService.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta,
    data,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await UserService.updateUserStatus(id as string, status);

  // Clear cache for users
  await clearCache('users');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await UserService.updateUserRole(id as string, role);

  // Clear cache for users
  await clearCache('users');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const getStatistics = catchAsync(async (req, res) => {
  const result = await UserService.getStatistics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Statistics retrieved successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUserFromDB(id as string);

  // Clear cache for users
  await clearCache('users');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { email } = req.user as JwtPayload;
  const result = await UserService.updateProfile(email, req.body);

  // Clear cache for users
  await clearCache('users');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getMe,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getStatistics,
  deleteUser,
  updateProfile,
};
