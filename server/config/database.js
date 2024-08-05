import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connects to the MongoDB database using the connection URI specified in the environment variables.
 *
 * @async
 * @function
 * @returns {Promise<void>} - Resolves when the connection is established successfully, or rejects with an error.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;