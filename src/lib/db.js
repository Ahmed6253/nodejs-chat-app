import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connction = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connction.connection.host}`);
  } catch (error) {
    console.log("MongoDB error: " + error);
  }
};
