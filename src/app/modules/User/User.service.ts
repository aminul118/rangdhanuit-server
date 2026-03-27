import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IUser } from './User.interface';
import { User } from './User.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createUserService = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { result, meta };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const getMe = async (email: string, role: string) => {
  const result = await User.findOne({ email, role });
  return result;
};

const updateUserStatus = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  return result;
};

const updateUserRole = async (id: string, role: string) => {
  const result = await User.findByIdAndUpdate(id, { role }, { new: true });
  return result;
};

const getStatistics = async () => {
  const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
  const activeUsers = await User.countDocuments({
    status: 'ACTIVE',
    isDeleted: { $ne: true },
  });
  const blockedUsers = await User.countDocuments({
    status: 'BLOCKED',
    isDeleted: { $ne: true },
  });
  const verifiedUsers = await User.countDocuments({
    isVerified: true,
    isDeleted: { $ne: true },
  });
  const adminUsers = await User.countDocuments({
    role: 'ADMIN',
    isDeleted: { $ne: true },
  });

  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    verifiedUsers,
    adminUsers,
  };
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const UserService = {
  createUserService,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getMe,
  updateUserStatus,
  updateUserRole,
  getStatistics,
  deleteUserFromDB,
};
