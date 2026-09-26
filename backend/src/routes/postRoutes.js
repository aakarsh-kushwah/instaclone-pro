import express from 'express';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.post('/', authenticate, upload.array('images'), postController.createPost);
router.get('/feed', authenticate, postController.getFeed);
router.get('/:id', authenticate, postController.getPostById);
router.post('/:id/like', authenticate, postController.likePost);
router.post('/:id/comment', authenticate, postController.commentPost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;
