import mongoose from 'mongoose';
import envVars from './env';

const connectDB = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;
