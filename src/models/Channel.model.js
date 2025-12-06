import mongoose from "mongoose";

// ================================
// Channel Schema
// ================================
const channelSchema = new mongoose.Schema({
    channelName: { type: String, required: true },            // Name of the channel
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who owns the channel
    description: { type: String },                             // Channel description

    // Banner image (Cloudinary)
    channelBanner: {
        url: { type: String, default: null },                 // URL of banner
        public_id: { type: String, default: null }           // Cloudinary public ID
    },

    subscribers: { type: Number, default: 0 },               // Number of subscribers
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // Videos uploaded to this channel
    createdAt: { type: Date, default: Date.now }             // Channel creation date
});

// Create model from schema
const Channel = mongoose.model("Channel", channelSchema);

export default Channel;