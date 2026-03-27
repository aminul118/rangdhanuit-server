/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import envVars from '../config/env';
import { User } from '../modules/User/User.model';

/**
 * Seeds a super admin user into the database based on environment variables.
 * This ensures at least one master account exists on server start.
 */
const seedSuperAdmin = async () => {
  try {
    const { NAME, EMAIL, PASSWORD } = envVars.SUPER_ADMIN;

    if (!EMAIL || !PASSWORD) {
      console.warn(
        '⚠️  Super Admin credentials not fully configured in environment variables. Skipping seed.',
      );
      return;
    }

    const isSuperAdminExist = await User.findOne({ email: EMAIL });

    if (isSuperAdminExist) {
      // console.log('ℹ️  Super admin already exists');
      return;
    }

    console.log('🚀 Initiating Super Admin seeding...');

    const hashedPassword = await bcrypt.hash(
      PASSWORD,
      envVars.BCRYPT_SALT_ROUND,
    );

    const payload = {
      name: NAME || 'Super Admin',
      email: EMAIL,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isVerified: true,
      isDeleted: false,
    };

    const superAdmin = await User.create(payload);
    console.log('✅ Super Admin created successfully:', superAdmin.email);
  } catch (error) {
    console.error('❌ Error seeding Super Admin:', error);
  }
};

export default seedSuperAdmin;
