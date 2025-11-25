import { configDotenv } from 'dotenv';
import express from 'express';
import { connectDB } from './src/config/db.js';

configDotenv();
connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000; // Server port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`); // Server start message
});