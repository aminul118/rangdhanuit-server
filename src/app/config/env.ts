import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import getEnv from '../helpers/getEnv';

const envPath =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), '.env.production')
    : [
        path.join(process.cwd(), '.env.local'),
        path.join(process.cwd(), '.env'),
      ].find((p) => fs.existsSync(p)) || path.join(process.cwd(), '.env');

dotenv.config({ path: envPath });

export const envFile = envPath;

const envVars = {
  PORT: getEnv('PORT'),
  DB_URL: getEnv('DB_URL'),
  NODE_ENV: getEnv('NODE_ENV'),
  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),
  JWT_ACCESS_EXPIRES: getEnv('JWT_ACCESS_EXPIRES'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES: getEnv('JWT_REFRESH_EXPIRES'),
  BCRYPT_SALT_ROUND: Number(getEnv('BCRYPT_SALT_ROUND')),
  FRONTEND_URL: getEnv('FRONTEND_URL'),
  COOKIE_DOMAIN: getEnv('COOKIE_DOMAIN'),
  SUPER_ADMIN: {
    NAME: getEnv('SUPER_ADMIN_NAME'),
    EMAIL: getEnv('SUPER_ADMIN_EMAIL'),
    PASSWORD: getEnv('SUPER_ADMIN_PASSWORD'),
  },
  EMAIL_SENDER: {
    SMTP_HOST: getEnv('SMTP_HOST'),
    SMTP_PORT: Number(getEnv('SMTP_PORT', '587')),
    SMTP_USER: getEnv('SMTP_USER'),
    SMTP_PASS: getEnv('SMTP_PASS'),
    SMTP_FROM: getEnv('SMTP_FROM'),
  },
  REDIS: {
    REDIS_HOST: getEnv('REDIS_HOST'),
    REDIS_PORT: Number(getEnv('REDIS_PORT', '6379')),
    REDIS_USERNAME: getEnv('REDIS_USERNAME', 'default'),
    REDIS_PASSWORD: getEnv('REDIS_PASSWORD'),
  },
  CLOUDINARY: {
    CLOUDINARY_NAME: getEnv('CLOUDINARY_NAME'),
    CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),
  },
};

export default envVars;
