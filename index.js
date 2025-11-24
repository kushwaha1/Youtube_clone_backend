import express from 'express';

const app = express();
app.use(express.json());

const PORT = 5000; // Server port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`); // Server start message
});