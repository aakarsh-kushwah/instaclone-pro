import express from 'express';
import { createStory, getStories } from '../controllers/storyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createStory);
router.get('/', authenticate, getStories);

export default router;
