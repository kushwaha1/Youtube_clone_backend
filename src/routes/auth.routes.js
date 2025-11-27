import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Route for user registration
router.post('/register', upload.single("avatar"), register);

// Route for user login
router.post('/login', login);

// Export router to use in main app
export default router;