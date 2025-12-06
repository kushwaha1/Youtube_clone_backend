import express from "express";
import { login, register, updateAvatar } from "../controllers/auth.controller.js"; // Import auth controller functions
import authMiddleware from "../middleware/auth.js";  // Middleware to protect routes (checks JWT token)
import { uploadImage } from "../middleware/multer.js"; // Middleware for handling file uploads (avatar images)

const router = express.Router();

// -------------------- REGISTER ROUTE --------------------
// Endpoint: POST /register
// Description: Registers a new user
// Middleware: 
// 1. uploadImage.single("avatar") -> Handles single file upload for "avatar" field
// Controller: register -> Handles user creation and validation
router.post('/register', uploadImage.single("avatar"), register);

// -------------------- LOGIN ROUTE --------------------
// Endpoint: POST /login
// Description: Authenticates an existing user and returns JWT token
// Controller: login -> Handles user login and password verification
router.post('/login', login);

// -------------------- UPDATE AVATAR ROUTE --------------------
// Endpoint: PUT /avatar
// Description: Updates the avatar of a logged-in user
// Middleware: 
// 1. authMiddleware -> Ensures the user is authenticated (JWT verification)
// 2. uploadImage.single("avatar") -> Handles single file upload for "avatar" field
// Controller: updateAvatar -> Updates user's avatar in database and Cloudinary
router.put("/avatar", authMiddleware, uploadImage.single("avatar"), updateAvatar);

// Export router to be used in main app (app.js or server.js)
export default router;