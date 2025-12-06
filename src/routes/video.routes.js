import express from "express";
import {
    getAllVideos,
    getVideoById,
    searchVideos,
    getVideosByCategory,
    uploadVideo,
    updateVideo,
    deleteVideo,
    incrementViews,
    toggleLike,
    toggleDislike,
    getLikeStatus
} from "../controllers/video.controller.js";
import authMiddleware from "../middleware/auth.js";
import { uploadImage } from "../middleware/multer.js";           // For thumbnail upload
import { uploadVideoFiles } from "../middleware/videoMulter.js"; // For video & thumbnail upload

const router = express.Router();

// ================================
// Public Routes
// ================================
router.get('/search', searchVideos);                  // Search videos by title
router.get('/category/:category', getVideosByCategory); // Get videos by category
router.get("/", getAllVideos);                        // Get all videos
router.get("/:videoId", getVideoById);               // Get single video with comments

// ================================
// Protected Routes (Auth Required)
// ================================
router.post("/upload", authMiddleware, uploadVideoFiles, uploadVideo); // Upload video + thumbnail
router.put("/:videoId", authMiddleware, uploadImage.single("thumbnail"), updateVideo); // Update video info/thumbnail
router.delete("/:videoId", authMiddleware, deleteVideo); // Delete video + thumbnail

// ================================
// Video Interactions
// ================================
router.post("/:videoId/view", incrementViews);          // Increment view count
router.post("/:videoId/like", authMiddleware, toggleLike);       // Like / unlike video
router.post("/:videoId/dislike", authMiddleware, toggleDislike); // Dislike / undislike video
router.get("/:videoId/like-status", authMiddleware, getLikeStatus); // Check like/dislike status for current user

export default router;