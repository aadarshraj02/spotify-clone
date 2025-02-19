import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MONGODB ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to DB", error);
    process.exit(1);
  }
};
