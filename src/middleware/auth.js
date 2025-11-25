import jwt from 'jsonwebtoken'; // Import JWT for token verification
import User from '../models/User.model';

// Authentication middleware
export default async function (req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // If no token, deny access
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload._id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;

        next(); // Proceed to next middleware/route
    } catch (err) {
        // If token invalid, deny access
        return res.status(401).json({ message: 'Token is not valid' });
    }
}