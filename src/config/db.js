// -------------------- MONGODB CONNECTION --------------------
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv(); // Load environment variables from .env file

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; // MongoDB connection string
        if(!mongoUri) {
            throw new Error("MongoDB URI is missing. Check your .env file.");
        }

        await mongoose.connect(mongoUri); // Connect to MongoDB
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error); // Log connection errors
        process.exit(1); // Exit process if DB connection fails
    }
}