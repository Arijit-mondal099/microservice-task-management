import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not defined.");
  process.exit(1);
}

export const connectToDatabase = async () => {
  try {
    const res = await mongoose.connect(MONGODB_URI);
    console.log("[Connected to MongoDB] HOST:", res.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
