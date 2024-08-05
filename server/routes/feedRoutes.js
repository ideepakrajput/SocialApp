import express from 'express';
import { getUserFeed } from '../controllers/feedController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getUserFeed);

export default router;