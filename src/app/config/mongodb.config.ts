import mongoose from 'mongoose';
import envVars from './env';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    logger.log('✅ Connected to MongoDB');
  } catch (error: unknown) {
    logger.error('❌ MongoDB connection failed:', (error as Error).message);
    throw error;
  }
};

export default connectDB;
