import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IUser } from './User.interface';
import { User } from './User.model';

const createUserService = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
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
  deleteUserFromDB,
};
