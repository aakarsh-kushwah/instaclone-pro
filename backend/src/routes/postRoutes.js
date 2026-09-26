import express from 'express';
import { createPost, getFeed, getUserPosts, likePost, commentOnPost, bookmarkPost } from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/feed', authenticate, getFeed);
router.get('/user/:userId', authenticate, getUserPosts);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/comment', authenticate, commentOnPost);
router.post('/:id/bookmark', authenticate, bookmarkPost);

export default router;
