import express from 'express';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';
import * as reelController from '../controllers/reelController.js';

const router = express.Router();

router.post('/', authenticate, upload.single('video'), reelController.createReel);
router.get('/', authenticate, reelController.getReels);
router.post('/:id/like', authenticate, reelController.likeReel);
router.post('/:id/comment', authenticate, reelController.commentReel);
router.post('/:id/view', authenticate, reelController.viewReel);

export default router;
