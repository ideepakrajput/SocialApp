import express from 'express';
import cors from "cors";
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import feedRoutes from './routes/feedRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

//CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/feed', feedRoutes);

export default app;