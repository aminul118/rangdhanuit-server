import { Types } from 'mongoose';
import envVars from '../config/env';
import { IUser } from '../modules/User/User.interface';
import { generateToken } from './jwt';

const createUserToken = (
  user: Partial<IUser & { _id: Types.ObjectId | string }>,
) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export { createUserToken };
