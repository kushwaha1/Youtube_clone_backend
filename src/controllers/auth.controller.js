import User from "../models/User.model.js";
import bcrypt from "bcryptjs";          // For hashing and comparing passwords
import jwt from "jsonwebtoken";         // For generating JWT tokens
import cloudinary from "../config/cloudinary.js"; // Cloudinary config for image upload
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js"; // Helper function to upload files

// -------------------- JWT TOKEN GENERATOR --------------------
// Generates a JWT token containing user ID and email
// Expires in time defined by environment variable JWT_EXPIRES_IN or defaults to 1 hour
const signToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

// -------------------- FORMAT USER RESPONSE --------------------
// Helper function to format the user object for responses
// Ensures only essential fields are sent back, not sensitive info like password
const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    userName: user.userName,
    email: user.email,
    avatar: typeof user.avatar === "object" ? user.avatar?.url : user.avatar
});

// -------------------- REGISTER USER --------------------
export const register = async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;
        let avatar = null;

        // If an avatar file is uploaded, upload to Cloudinary
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            avatar = { url: result.secure_url, public_id: result.public_id };
        }

        // Validate required fields
        if (!name || !userName || !email || !password) {
            return res.status(400).json({ statusCode: 400, message: 'Name, username, email and password are required' });
        }

        const trimmedName = name.trim();

        // Validate name length
        if (trimmedName.length < 2 || trimmedName.length > 50) {
            return res.status(400).json({ statusCode: 400, message: "Name must be between 2 and 50 characters" });
        }

        // Validate name contains only letters and spaces
        if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
            return res.status(400).json({ statusCode: 400, message: "Name can contain only letters and spaces" });
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ statusCode: 400, message: 'Password must be at least 8 characters' });
        }

        // Validate password complexity: uppercase, lowercase, number & special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ statusCode: 400, message: 'Password must contain uppercase, lowercase, number & special character' });
        }

        // Check if user with same email or username already exists
        const exists = await User.findOne({ $or: [{ email }, { userName }] });
        if (exists) return res.status(400).json({ statusCode: 400, message: 'User already exists' });

        // Hash the password before saving
        const hashed = await bcrypt.hash(password, 10);

        // Create new user in database
        const user = await User.create({ name: trimmedName, userName, email, password: hashed, avatar });

        // Respond with success message and formatted user data
        res.status(201).json({
            statusCode: 201,
            message: 'User registered successfully',
            data: formatUser(user)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
};

// -------------------- LOGIN USER --------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ statusCode: 400, message: 'Email and password are required' });
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid email format' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ statusCode: 401, message: 'User does not exist.. Create account!' });

        // Compare provided password with hashed password in DB
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ statusCode: 401, message: 'Invalid Password!' });

        // Generate JWT token
        const token = signToken(user);

        // Respond with token and formatted user data
        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            data: { token, ...formatUser(user) }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
};

// -------------------- UPDATE AVATAR --------------------
export const updateAvatar = async (req, res) => {
    try {
        // Find the logged-in user
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // If user has an existing avatar, delete it from Cloudinary
        if (user.avatar?.public_id) await cloudinary.uploader.destroy(user.avatar.public_id);

        // Upload new avatar to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        user.avatar = { url: result.secure_url, public_id: result.public_id };

        // Save updated user document
        await user.save();

        // Respond with updated avatar URL
        res.status(200).json({
            statusCode: 200,
            message: 'Avatar updated successfully',
            avatar: typeof user.avatar === "object" ? user.avatar?.url : user.avatar
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};