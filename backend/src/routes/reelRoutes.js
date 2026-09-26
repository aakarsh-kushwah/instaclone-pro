import express from 'express';
import { createReel, getReels, likeReel, commentOnReel } from '../controllers/reelController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createReel);
router.get('/', authenticate, getReels);
router.post('/:id/like', authenticate, likeReel);
router.post('/:id/comment', authenticate, commentOnReel);

export default router;
