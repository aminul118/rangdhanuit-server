import { Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  status: UserStatus;
  isDeleted: boolean;
  picture?: string;
  designation?: string;
  bio?: string;
  contactNo?: string;
  slug?: string;
}


export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
