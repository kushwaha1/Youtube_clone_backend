import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";
import Channel from "../models/Channel.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

// ================================
// Get All Videos with basic info & comment count
// ================================
export const getAllVideos = async (req, res) => {
    try {
        // Fetch all videos, populate channel & uploader, sort by newest
        const videos = await Video.find()
            .populate("channel", "channelName channelBanner subscribers")
            .populate("uploader", "name userName email avatar")
            .sort({ createdAt: -1 })
            .lean(); // plain JS object for better performance

        // Add comment count for each video
        const videosWithInfo = await Promise.all(
            videos.map(async (video) => {
                const commentCount = await Comment.countDocuments({ video: video._id });

                return {
                    videoId: video._id,
                    title: video.title,
                    thumbnailUrl: video.thumbnailUrl,
                    videoUrl: video.videoUrl,
                    description: video.description,
                    category: video.category,
                    channel: {
                        channelId: video.channel?._id,
                        channelName: video.channel?.channelName,
                        channelBanner: video.channel?.channelBanner,
                        subscribers: video.channel?.subscribers
                    },
                    uploader: {
                        uploaderId: video.uploader?._id,
                        name: video.uploader?.name,
                        userName: video.uploader?.userName,
                        email: video.uploader?.email,
                        avatar: video.uploader?.avatar
                    },
                    views: video.views,
                    likes: video.likes,
                    dislikes: video.dislikes,
                    uploadDate: video.createdAt,
                    totalComments: commentCount
                };
            })
        );

        res.status(200).json({ success: true, count: videosWithInfo.length, videos: videosWithInfo });
    } catch (err) {
        console.error("Get Videos Error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ================================
// Get Single Video with comments
// ================================
export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId)
            .populate("channel", "channelName channelBanner subscribers")
            .populate("uploader", "name userName email avatar")
            .lean();

        if (!video) return res.status(404).json({ success: false, message: "Video not found" });

        // Fetch comments for this video
        const comments = await Comment.find({ video: video._id })
            .populate("user", "name userName avatar")
            .sort({ createdAt: -1 })
            .lean();

        // Format response
        const videoWithComments = {
            videoId: video._id,
            title: video.title,
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            description: video.description,
            category: video.category,
            channel: {
                channelId: video.channel?._id,
                channelName: video.channel?.channelName,
                channelBanner: video.channel?.channelBanner,
                subscribers: video.channel?.subscribers
            },
            uploader: {
                uploaderId: video.uploader?._id,
                name: video.uploader?.name,
                userName: video.uploader?.userName,
                email: video.uploader?.email,
                avatar: video.uploader?.avatar
            },
            views: video.views,
            likes: video.likes,
            dislikes: video.dislikes,
            uploadDate: video.createdAt,
            comments: comments.map(comment => ({
                commentId: comment._id,
                userId: comment.user?._id,
                userName: comment.user?.userName,
                userAvatar: comment.user?.avatar,
                text: comment.text,
                timestamp: comment.createdAt
            })),
            totalComments: comments.length
        };

        res.status(200).json({ success: true, video: videoWithComments });
    } catch (err) {
        console.error("Get Single Video Error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ================================
// Get Videos by Category (with top comments)
// ================================
export const getVideosByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Case-insensitive match
        const videos = await Video.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } })
            .populate("channel", "channelName channelBanner subscribers")
            .populate("uploader", "name userName email avatar")
            .sort({ createdAt: -1 })
            .lean();

        // Add top 5 comments for each video
        const videosWithComments = await Promise.all(
            videos.map(async (video) => {
                const comments = await Comment.find({ video: video._id })
                    .populate("user", "name userName avatar")
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean();

                return {
                    videoId: video._id,
                    title: video.title,
                    thumbnailUrl: video.thumbnailUrl,
                    videoUrl: video.videoUrl,
                    description: video.description,
                    category: video.category,
                    channel: {
                        channelId: video.channel?._id,
                        channelName: video.channel?.channelName
                    },
                    uploader: {
                        uploaderId: video.uploader?._id,
                        userName: video.uploader?.userName,
                        avatar: video.uploader?.avatar
                    },
                    views: video.views,
                    likes: video.likes,
                    dislikes: video.dislikes,
                    uploadDate: video.createdAt,
                    comments: comments.map(comment => ({
                        commentId: comment._id,
                        userId: comment.user?._id,
                        userName: comment.user?.userName,
                        text: comment.text,
                        timestamp: comment.createdAt
                    })),
                    totalComments: await Comment.countDocuments({ video: video._id })
                };
            })
        );

        res.status(200).json({ success: true, category, count: videosWithComments.length, videos: videosWithComments });
    } catch (err) {
        console.error("Get Videos by Category Error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ================================
// Search Videos by Title
// ================================
export const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query?.trim()) return res.status(400).json({ success: false, message: "Search query is required" });

        // Search only in video titles, case-insensitive
        const videos = await Video.find({ title: { $regex: query.trim(), $options: "i" } })
            .populate("channel", "channelName")
            .populate("uploader", "name userName avatar")
            .sort({ views: -1 }) // Most viewed first
            .lean();

        // Add comment count for each video
        const videosWithInfo = await Promise.all(
            videos.map(async (video) => {
                const commentCount = await Comment.countDocuments({ video: video._id });
                return {
                    videoId: video._id,
                    title: video.title,
                    thumbnailUrl: video.thumbnailUrl,
                    videoUrl: video.videoUrl,
                    description: video.description,
                    category: video.category,
                    channel: { channelId: video.channel?._id, channelName: video.channel?.channelName },
                    uploader: { userName: video.uploader?.userName, avatar: video.uploader?.avatar },
                    views: video.views,
                    likes: video.likes,
                    uploadDate: video.createdAt,
                    totalComments: commentCount
                };
            })
        );

        res.status(200).json({ success: true, query: query.trim(), count: videosWithInfo.length, videos: videosWithInfo });
    } catch (err) {
        console.error("Search Videos Error:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ================================
// Upload Video + Thumbnail
// ================================
export const uploadVideo = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

        // Check if user has a channel
        const channel = await Channel.findOne({ owner: req.user._id });
        if (!channel) return res.status(403).json({ message: "Create a channel first" });

        const videoFile = req.files.video?.[0];
        const thumbnailFile = req.files.thumbnail?.[0];
        if (!videoFile || !thumbnailFile) return res.status(400).json({ message: "Video & thumbnail required" });

        // Upload video to Cloudinary
        const videoResult = await cloudinary.uploader.upload(videoFile.path, { resource_type: "video", folder: "youtube-clone/videos" });

        // Upload thumbnail to Cloudinary
        const thumbResult = await uploadToCloudinary(thumbnailFile.buffer, "youtube-clone/thumbnails");

        // Save video in DB
        const video = await Video.create({
            title,
            description,
            category,
            videoUrl: { url: videoResult.secure_url, public_id: videoResult.public_id },
            thumbnailUrl: { url: thumbResult.secure_url, public_id: thumbResult.public_id },
            channel: channel._id,
            uploader: req.user._id
        });

        // Add video ref to channel
        channel.videos.push(video._id);
        await channel.save();

        res.status(201).json({ success: true, message: "Video uploaded successfully", video });
    } catch (err) {
        console.error("VIDEO UPLOAD ERROR:", err);
        res.status(500).json({ message: "Video upload failed" });
    }
};

// ================================
// Update Video Info & Thumbnail
// ================================
export const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description, category } = req.body;

        const video = await Video.findById(videoId).populate("channel");
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Only owner can update
        if (video.channel.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

        if (title) video.title = title;
        if (description) video.description = description;
        if (category) video.category = category;

        // Update thumbnail if provided
        if (req.file) {
            if (video.thumbnailUrl?.public_id) await cloudinary.uploader.destroy(video.thumbnailUrl.public_id);
            const result = await uploadToCloudinary(req.file.buffer, "youtube-clone/thumbnails");
            video.thumbnailUrl = { url: result.secure_url, public_id: result.public_id };
        }

        await video.save();
        res.status(200).json({ success: true, message: "Video updated successfully", video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ================================
// Delete Video + Thumbnail + remove ref from channel
// ================================
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });

        const channel = await Channel.findById(video.channel);
        if (channel.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

        // Delete video file
        if (video.videoUrl?.public_id) await cloudinary.uploader.destroy(video.videoUrl.public_id, { resource_type: "video" });
        // Delete thumbnail
        if (video.thumbnailUrl?.public_id) await cloudinary.uploader.destroy(video.thumbnailUrl.public_id);

        // Remove video reference from channel
        await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: videoId } });

        await video.deleteOne();
        res.status(200).json({ success: true, message: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ================================
// Toggle Like
// ================================
export const toggleLike = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });

        // Initialize arrays
        if (!video.likedBy) video.likedBy = [];
        if (!video.dislikedBy) video.dislikedBy = [];

        const hasLiked = video.likedBy.some(id => id.toString() === userId.toString());
        const hasDisliked = video.dislikedBy.some(id => id.toString() === userId.toString());

        if (hasLiked) {
            video.likes = Math.max(0, video.likes - 1);
            video.likedBy = video.likedBy.filter(id => id.toString() !== userId.toString());
        } else {
            video.likes += 1;
            video.likedBy.push(userId);
            if (hasDisliked) {
                video.dislikes = Math.max(0, video.dislikes - 1);
                video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId.toString());
            }
        }

        await video.save();
        res.status(200).json({ success: true, message: hasLiked ? "Like removed" : "Video liked", likes: video.likes, dislikes: video.dislikes, hasLiked: !hasLiked, hasDisliked: false });
    } catch (err) {
        console.error("Toggle Like Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Toggle Dislike
// ================================
export const toggleDislike = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });

        // Initialize arrays
        if (!video.likedBy) video.likedBy = [];
        if (!video.dislikedBy) video.dislikedBy = [];

        const hasDisliked = video.dislikedBy.some(id => id.toString() === userId.toString());
        const hasLiked = video.likedBy.some(id => id.toString() === userId.toString());

        if (hasDisliked) {
            video.dislikes = Math.max(0, video.dislikes - 1);
            video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId.toString());
        } else {
            video.dislikes += 1;
            video.dislikedBy.push(userId);
            if (hasLiked) {
                video.likes = Math.max(0, video.likes - 1);
                video.likedBy = video.likedBy.filter(id => id.toString() !== userId.toString());
            }
        }

        await video.save();
        res.status(200).json({ success: true, message: hasDisliked ? "Dislike removed" : "Video disliked", likes: video.likes, dislikes: video.dislikes, hasLiked: false, hasDisliked: !hasDisliked });
    } catch (err) {
        console.error("Toggle Dislike Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Get Like/Dislike Status for current user
// ================================
export const getLikeStatus = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(videoId).select('likedBy dislikedBy');
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });

        const hasLiked = video.likedBy?.some(id => id.toString() === userId.toString()) || false;
        const hasDisliked = video.dislikedBy?.some(id => id.toString() === userId.toString()) || false;

        res.status(200).json({ success: true, hasLiked, hasDisliked });
    } catch (err) {
        console.error("Get Like Status Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Increment View Count
// ================================
export const incrementViews = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });
        if (!video) return res.status(404).json({ success: false, message: "Video not found" });

        res.status(200).json({ success: true, message: "View counted", views: video.views });
    } catch (err) {
        console.error("Increment Views Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};