import { configDotenv } from 'dotenv';
import express from 'express';
import { connectDB } from './src/config/db.js';
import authRoutes from "./src/routes/auth.routes.js";
import videoRoutes from "./src/routes/video.routes.js";
import channelRoutes from "./src/routes/channel.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';

// ==========================
// Load environment variables
// ==========================
configDotenv();

// ==========================
// Connect to MongoDB
// ==========================
connectDB();

const app = express();

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors()); // Enable CORS
app.use(express.json({ limit: "200mb" })); // Parse JSON request body
app.use(express.urlencoded({ extended: true, limit: "200mb" })); // Parse URL-encoded body
app.use(morgan("dev")); // Logger for development

// ==========================
// ROUTES
// ==========================
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/videos', videoRoutes);    // Video management routes
app.use('/api/channel', channelRoutes); // Channel management routes
app.use('/api/comment', commentRoutes); // Comment routes

// ==========================
// MULTER ERROR HANDLER
// ==========================
// Handle file upload errors (multer) and invalid file type errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message?.includes("Only")) {
    return res.status(400).json({ message: err.message });
  }

  next(err); // Pass other errors to default error handler
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000; // Define server port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`); // Log server start
});