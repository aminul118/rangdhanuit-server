import bcrypt from 'bcryptjs';
import envVars from '../config/env';

/**
 * Hashes a plain text password using bcrypt.
 * Uses the BCRYPT_SALT_ROUND from environment variables.
 * 
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, envVars.BCRYPT_SALT_ROUND);
};

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param password - The plain text password.
 * @param hashed - The hashed password.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

