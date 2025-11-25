import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, lowercase: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://example.com/avatar/default.png' },
    channels: { type: String },
    createdAt: { type: Date, default: Date.now() }
})

const User = mongoose.model("User", userSchema);
export default User;
