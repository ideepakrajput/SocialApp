import express from 'express';
import { createPost, addComment, getPost, updatePost, deletePost,getPosts } from '../controllers/postController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createPost);
router.post('/:postId/comment', auth, addComment);
router.get('/', auth, getPosts);
router.get('/:postId', auth, getPost);
router.put('/:postId', auth, updatePost);
router.delete('/:postId', auth, deletePost);

export default router;