import express from "express";
import { login, register } from "../controller/auth.controller.js";

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Export router to use in main app
export default router;