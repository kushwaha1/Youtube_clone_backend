import express from "express";
import {
    createChannel,
    getAllChannels,
    getChannelById,
    getMyChannel,
    getChannelVideos,
    updateChannel,
    deleteChannel,
    subscribeChannel,
    unsubscribeChannel,
    checkSubscription
} from "../controllers/channel.controller.js";
import authMiddleware from "../middleware/auth.js";
import { uploadImage } from "../middleware/multer.js";

const router = express.Router();

// ================================
// CHANNEL ROUTES
// ================================

// Public Routes
router.get("/", getAllChannels); // Get all channels

// Protected Routes - Order matters!
router.get("/me", authMiddleware, getMyChannel); // Get my channel (MUST come before /:channelId)

// Parameterized routes (after specific routes)
router.get("/:channelId", getChannelById); // Get single channel
router.get("/:channelId/videos", getChannelVideos); // Get channel videos
router.get("/:channelId/subscription-status", authMiddleware, checkSubscription); // Check subscription

// Create, Update, Delete (Auth + File Upload)
router.post("/", authMiddleware, uploadImage.single("channelBanner"), createChannel); // Use existing multer
router.put("/:channelId", authMiddleware, uploadImage.single("channelBanner"), updateChannel); // Use existing multer
router.delete("/:channelId", authMiddleware, deleteChannel); // Delete channel

// Subscribe/Unsubscribe
router.post("/:channelId/subscribe", authMiddleware, subscribeChannel);
router.post("/:channelId/unsubscribe", authMiddleware, unsubscribeChannel);

export default router;