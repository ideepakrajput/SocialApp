import express from 'express';
import { signup, login, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', auth, getAllUsers);
router.post('/friend-request', auth, sendFriendRequest);
router.post('/accept-friend-request', auth, acceptFriendRequest);
router.post('/reject-friend-request', auth, rejectFriendRequest);
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);

export default router;