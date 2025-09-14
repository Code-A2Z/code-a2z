import mongoose from "mongoose";

const connectDB = async () => {
  const mongodbUri = process.env.MONGODB_URL || "mongodb://localhost:27017/";
  try {
    await mongoose.connect(mongodbUri, { autoIndex: true });
    console.log("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.error("Database connection failed:", error);
    }
    process.exit(1);
  }
};

export default connectDB;
