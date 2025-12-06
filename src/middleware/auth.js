import jwt from 'jsonwebtoken'; // For verifying JWT tokens
import User from '../models/User.model.js';

// Authentication middleware to protect routes
export default async function (req, res, next) {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;    

    // If token is missing, deny access
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Verify token and decode payload
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB (excluding password)
        const user = await User.findById(payload.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user; // Attach user to request object
        next();          // Proceed to next middleware or route
    } catch (err) {
        console.log("error", err);
        // If token invalid or expired, deny access
        return res.status(401).json({ message: 'Token is not valid' });
    }
}