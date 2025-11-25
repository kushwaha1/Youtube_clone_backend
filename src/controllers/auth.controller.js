import User from "../models/User.model";
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
        const { userName, email, password } = req.body;

        // Check for missing fields
        if (!userName || !email || !password) {
            return res.status(400).json({ statusCode: 400, message: 'Username, email and password avatar are required' });
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ statusCode: 400, message: 'Password must be at least 8 characters' });
        }

        // Regex for uppercase, lowercase, number, special char
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }

        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ statusCode: 400, message: 'Email already registered' });
        }

        // Encrypt password before saving
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({ name, email, password: hashed });

        // Send success response
        res.status(201).json({
            statusCode: 201,
            message: 'User registered successfully',
            data: { user: { id: user._id, name: user.name, email: user.email } }
        });

    } catch (err) {
        console.error(err); // Log error to console
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

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ statusCode: 401, message: 'Invalid credentials' });
        }

        // Compare entered password with stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ statusCode: 401, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = signToken(user);

        // Send success response with token
        res.status(200).json({
            statusCode: 200,
            message: 'Login successful',
            data: { token, id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        console.error(err); // Log error to console
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
}