import mongoose from "mongoose";

// ================================
// Comment Schema
// ================================
const commentSchema = new mongoose.Schema({
    video: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Video',        // Reference to the Video this comment belongs to
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',         // Reference to the User who posted the comment
        required: true 
    },
    text: { 
        type: String,        // The comment text
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now    // Timestamp when comment was created
    }
});

// Create Comment model from schema
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
