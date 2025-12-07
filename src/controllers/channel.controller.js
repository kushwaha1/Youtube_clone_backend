import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "cloudinary";

// ================================
// Helper to format channel response
// ================================
const formatChannel = (channel) => ({
    id: channel._id,
    channelName: channel.channelName,
    owner: channel.owner,
    description: channel.description,
    channelBanner: channel.channelBanner ?? channel.channelBanner.url,
    subscribers: channel.subscribers,
    videos: channel.videos,
    createdAt: channel.createdAt
});

// ================================
// Populate owner info with avatar fix
// ================================
const ownerPopulate = {
    path: "owner",
    select: "name userName email avatar",
    transform: (doc) => {
        if (!doc) return null;
        return {
            id: doc._id,
            name: doc.name,
            userName: doc.userName,
            email: doc.email,
            avatar: doc.avatar ?? doc.avatar?.url
        };
    }
};

// ================================
// Create Channel
// ================================
export const createChannel = async (req, res) => {
    try {
        const { channelName, description } = req.body;

        if (!channelName?.trim()) return res.status(400).json({ success: false, message: "Channel name is required" });

        // Check if user already has a channel
        const existingChannel = await Channel.findOne({ owner: req.user._id });
        if (existingChannel) return res.status(400).json({ success: false, message: "You already have a channel" });

        // Upload banner if file provided
        let channelBanner = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "youtube-clone/channel-banners");
            channelBanner = { url: result.secure_url, public_id: result.public_id };
        }

        // Create channel
        const channel = await Channel.create({
            channelName: channelName.trim(),
            owner: req.user._id,
            description: description?.trim() || "",
            channelBanner,
            subscribers: 0,
            videos: []
        });

        // Add channel reference to user
        await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });
        await channel.populate(ownerPopulate);

        res.status(201).json({
            statusCode: 201,
            message: "Channel created successfully",
            data: formatChannel(channel)
        });

    } catch (err) {
        console.error("Create Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Get My Channel
// ================================
export const getMyChannel = async (req, res) => {
    try {
        const channel = await Channel.findOne({ owner: req.user._id })
            .populate(ownerPopulate)
            .populate("videos");

        if (!channel) return res.status(404).json({ success: false, message: "You don't have a channel yet" });

        res.status(200).json({ success: true, channel: formatChannel(channel) });

    } catch (err) {
        console.error("Get My Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Get All Channels
// ================================
export const getAllChannels = async (req, res) => {
    try {
        const channels = await Channel.find()
            .populate(ownerPopulate)
            .sort({ subscribers: -1 }); // Most subscribed first

        res.status(200).json({
            success: true,
            count: channels.length,
            channels: channels.map(formatChannel)
        });

    } catch (err) {
        console.error("Get All Channels Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Get Channel By ID
// ================================
export const getChannelById = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId)
            .populate(ownerPopulate)
            .populate("videos");

        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        res.status(200).json({ success: true, channel: formatChannel(channel) });

    } catch (err) {
        console.error("Get Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Get Videos of a Channel
// ================================
export const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { sort = "latest" } = req.query;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        // Sorting options
        let sortOption =
            sort === "oldest" ? { createdAt: 1 } :
            sort === "popular" ? { views: -1 } :
            { createdAt: -1 }; // default: latest

        const videos = await Video.find({ channel: channelId })
            .populate({
                path: "uploader",
                select: "name userName avatar",
                transform: (doc) => ({
                    _id: doc._id,
                    name: doc.name,
                    userName: doc.userName,
                    avatar: typeof doc.avatar === "object" ? doc.avatar?.url : doc.avatar
                })
            })
            .sort(sortOption);

        res.status(200).json({ success: true, count: videos.length, videos });

    } catch (err) {
        console.error("Get Channel Videos Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Update Channel
// ================================
export const updateChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { channelName, description } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ message: "Channel not found" });
        if (channel.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

        if (channelName) channel.channelName = channelName;
        if (description) channel.description = description;

        // Update banner if new file uploaded
        if (req.file) {
            if (channel.channelBanner?.public_id) {
                await cloudinary.uploader.destroy(channel.channelBanner.public_id);
            }
            const result = await uploadToCloudinary(req.file.buffer, "youtube-clone/channel-banners");
            channel.channelBanner = { url: result.secure_url, public_id: result.public_id };
        }

        await channel.save();
        await channel.populate(ownerPopulate);

        res.json({ success: true, channel: formatChannel(channel) });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ================================
// Delete Channel
// ================================
export const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });
        if (channel.owner.toString() !== req.user._id.toString())
            return res.status(403).json({ success: false, message: "Not authorized" });

        await Video.deleteMany({ channel: channelId }); // Remove all channel videos
        await User.findByIdAndUpdate(req.user._id, { $pull: { channels: channelId } });
        await channel.deleteOne(); // Delete channel

        res.status(200).json({ success: true, message: "Channel deleted successfully" });

    } catch (err) {
        console.error("Delete Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Subscribe Channel
// ================================
export const subscribeChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });
        if (channel.owner.toString() === req.user._id.toString())
            return res.status(400).json({ success: false, message: "Cannot subscribe to your own channel" });

        // Check if user already subscribed
        if (channel.subscriberList.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: "Already subscribed" });
        }

        // Add user to subscriberList and increment count
        channel.subscriberList.push(req.user._id);
        channel.subscribers = channel.subscribers + 1;
        await channel.save();

        res.status(200).json({ success: true, message: "Subscribed successfully", subscribers: channel.subscribers });

    } catch (err) {
        console.error("Subscribe Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Unsubscribe Channel
// ================================
export const unsubscribeChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        // Remove user if subscribed
        // Remove user if subscribed
        const wasSubscribed = channel.subscriberList.some(
            userId => userId.toString() === req.user._id.toString()
        );

        channel.subscriberList = channel.subscriberList.filter(
            userId => userId.toString() !== req.user._id.toString()
        );
        
        if (wasSubscribed) {
            channel.subscribers = Math.max(0, channel.subscribers - 1);
        }
        await channel.save();

        res.status(200).json({ success: true, message: "Unsubscribed successfully", subscribers: channel.subscribers });

    } catch (err) {
        console.error("Unsubscribe Channel Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ================================
// Check Subscription
// ================================
export const checkSubscription = async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ success: false, message: "Channel not found" });

        const isSubscribed = channel.subscriberList.includes(req.user._id);

        res.status(200).json({ success: true, isSubscribed, subscribers: channel.subscribers });

    } catch (err) {
        console.error("Check Subscription Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};