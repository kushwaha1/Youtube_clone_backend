import mongoose from "mongoose";

// Define the schema for User collection
const userSchema = new mongoose.Schema({
    // Full name of the user, required, and any extra spaces will be trimmed
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Unique username for the user
    // Will always be stored in lowercase for consistency
    userName: { 
        type: String, 
        required: true, 
        lowercase: true, 
        unique: true 
    },

    // User's email address
    // Required, must be unique, stored in lowercase and trimmed
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },

    // User's password
    // Required (hashed password should be stored here)
    password: { 
        type: String, 
        required: true 
    },

    // User avatar information
    // Stores both the image URL and its public ID (for cloud storage like Cloudinary)
    avatar: {
        url: { type: String, default: null },        // Link to the avatar image
        public_id: { type: String, default: null }   // Public ID for external image storage
    },

    // Array of channel IDs that the user is part of
    // References the 'Channel' collection
    channels: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Channel" 
    }],

    // Timestamp of when the user document was created
    // Defaults to current date and time
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create the User model from the schema
// This model allows us to interact with the 'users' collection in MongoDB
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;