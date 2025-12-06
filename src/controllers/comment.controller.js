import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";

// ================================
// Add Comment
// ================================
export const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Comment text is required" 
            });
        }

        // Check if video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ 
                success: false,
                message: "Video not found" 
            });
        }

        // Create comment
        const comment = await Comment.create({
            video: videoId,
            user: req.user._id,
            text: text.trim()
        });

        // Populate user details
        await comment.populate('user', 'name userName email avatar');

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment
        });

    } catch (err) {
        console.error("Add Comment Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};


// ================================
// Get Comments By Video
// ================================
export const getCommentsByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Check if video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ 
                success: false,
                message: "Video not found" 
            });
        }

        // Get all comments for this video
        const comments = await Comment.find({ video: videoId })
            .populate('user', 'name userName email avatar')
            .sort({ createdAt: -1 }); // Latest first

        res.status(200).json({ 
            success: true,
            count: comments.length,
            comments 
        });

    } catch (err) {
        console.error("Get Comments Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};


// ================================
// Update Comment
// ================================
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "Comment text is required" 
            });
        }

        // Find comment
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found" 
            });
        }

        // Check if user is the comment owner
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: "Not authorized to edit this comment" 
            });
        }

        // Update comment
        comment.text = text.trim();
        await comment.save();

        // Populate user details
        await comment.populate('user', 'name userName email avatar');

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });

    } catch (err) {
        console.error("Update Comment Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};


// ================================
// Delete Comment
// ================================
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Find comment
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: "Comment not found" 
            });
        }

        // Check if user is the comment owner
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: "Not authorized to delete this comment" 
            });
        }

        // Delete comment
        await comment.deleteOne();

        res.status(200).json({ 
            success: true,
            message: "Comment deleted successfully" 
        });

    } catch (err) {
        console.error("Delete Comment Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};