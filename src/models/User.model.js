import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    userName: { type: String, required: true, lowercase: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg' },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    createdAt: { type: Date, default: Date.now() }
})

const User = mongoose.model("User", userSchema);
export default User;
