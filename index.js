import { configDotenv } from 'dotenv';
import express from 'express';
import { connectDB } from './src/config/db.js';
import authRoutes from "./src/routes/auth.routes.js";
import morgan from 'morgan';
import cors from 'cors';

configDotenv();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


// Route middlewares
app.use('/api/auth', authRoutes);      // Auth routes: /auth/*

const PORT = process.env.PORT || 5000; // Server port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`); // Server start message
});