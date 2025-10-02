import mongoose from 'mongoose';

import { MONGODB_URL } from '../constants/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, { autoIndex: true });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
