import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
thumbnailUrl: { type: String },
videoUrl: { type: String },
category: { type: String },
channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
views: { type: Number, default: 0 },
likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now() }
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);
export default Video;

