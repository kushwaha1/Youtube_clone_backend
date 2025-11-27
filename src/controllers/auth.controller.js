import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to generate a signed JWT token for a user
const signToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },        // Payload data (user ID and email)
        process.env.JWT_SECRET,                     // Secret key for signing
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Expiration time (default: 1 hour)
    );
};

// -------------------- REGISTER USER --------------------
export const register = async (req, res) => {
    try {
        const body = req.body || {};
        const { name, userName, email, password } = body;
        const avatar = req.file?.path; // optional avatar

        // Missing fields check
        if (!name || !userName || !email || !password) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Name, username, email and password are required'
            });
        }

        if (typeof name !== "string") {
            return res.status(400).json({
                statusCode: 400,
                message: "Name must be a string"
            });
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 50) {
            return res.status(400).json({
                statusCode: 400,
                message: "Name must be between 2 and 50 characters"
            });
        }

        if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Name can contain only letters and spaces"
            });
        }


        // Email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid email format'
            });
        }

        // Password length + strength
        if (password.length < 8) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Password must be at least 8 characters'
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Password must contain uppercase, lowercase, number & special character'
            });
        }

        // Check existing user (email OR userName)
        const exists = await User.findOne({ $or: [{ email }, { userName }] });
        if (exists) {
            return res.status(400).json({
                statusCode: 400,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // CREATE USER (FIXED FIELD NAMES)
        const user = await User.create({
            name: trimmedName,
            userName,
            email,
            password: hashed,
            avatar
        });

        res.status(201).json({
            statusCode: 201,
            message: 'User registered successfully',
            data: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
};

// -------------------- LOGIN USER --------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Extract login credentials

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ statusCode: 400, message: 'Email and password are required' });
        }

        // Email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid email format'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ statusCode: 401, message: 'User does not exist.. Create account!' });
        }

        // Compare entered password with stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ statusCode: 401, message: 'Invalid Password!' });
        }

        // Generate JWT token
        const token = signToken(user);

        // Send success response with token
        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            data: { token, id: user._id, name: user.name, userName: user.userName, email: user.email, avatar: user.avatar }
        });

    } catch (err) {
        console.error(err); // Log error to console
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
}