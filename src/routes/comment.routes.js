import express from "express";
import {
    addComment,
    getCommentsByVideo,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ==========================
// PUBLIC ROUTES
// ==========================
// Get all comments for a specific video
router.get("/video/:videoId", getCommentsByVideo);

// ==========================
// PROTECTED ROUTES (Require Auth)
// ==========================
// Add a new comment to a specific video
router.post("/video/:videoId", authMiddleware, addComment);

// Update a specific comment (only by the owner)
router.put("/:commentId", authMiddleware, updateComment);

// Delete a specific comment (only by the owner)
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;