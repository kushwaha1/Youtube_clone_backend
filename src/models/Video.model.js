import mongoose from "mongoose";

// Define Video schema
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },        // Video title (required)
    description: { type: String },                  // Optional video description

    // Thumbnail info (Cloudinary or other storage)
    thumbnailUrl: {
        url: { type: String, default: null },      // Thumbnail image URL
        public_id: { type: String, default: null } // Cloudinary public ID
    },

    // Video file info (Cloudinary or other storage)
    videoUrl: {
        url: { type: String, default: null },      // Video file URL
        public_id: { type: String, default: null } // Cloudinary public ID
    },

    category: { type: String },                     // Video category/tag
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }, // Reference to channel
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to uploader (user)

    views: { type: Number, default: 0 },           // Total views count
    likes: { type: Number, default: 0 },           // Total likes count
    dislikes: { type: Number, default: 0 },        // Total dislikes count

    // Users who liked the video
    likedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    // Users who disliked the video
    dislikedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    
    // Seed tag for updating only seed data
    seedTag: { type: String, default: null },

    createdAt: { type: Date, default: Date.now() } // Timestamp of video upload
});

// Create Video model
const Video = mongoose.model("Video", videoSchema);
export default Video;