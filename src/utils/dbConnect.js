import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB server Connect Successfuly 🔥');
  } catch (error) {
    console.log('Error: Failed Connecting to MongoDB server ');
    console.error(error);
    console.log(error.message);
    process.exit(1);
  }
};
