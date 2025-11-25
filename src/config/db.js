import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if(!mongoUri) {
            throw new Error("MongoDB URI is missing. Check your .env file.");
        }

        await mongoose.connect(mongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error);
        process.exit(1);
    }
}