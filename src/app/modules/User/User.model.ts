import { Schema, model } from 'mongoose';
import { hashPassword, comparePassword } from '../../utils/hashPassword';



import { IUser, UserModel } from './User.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: {
      type: String,
      enum: ['ADMIN', 'USER', 'SUPER_ADMIN'],
      default: 'USER',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    picture: { type: String },
    designation: { type: String },
    bio: { type: String },
    contactNo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainPassword,
  hashedPassword,
) {
  return await comparePassword(plainPassword, hashedPassword);

};

export const User = model<IUser, UserModel>('User', userSchema);
