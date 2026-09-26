import express from 'express';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';
import * as storyController from '../controllers/storyController.js';

const router = express.Router();

router.post('/', authenticate, upload.single('media'), storyController.createStory);
router.get('/', authenticate, storyController.getStories);
router.get('/user/:userId', authenticate, storyController.getUserStories);
router.post('/:id/view', authenticate, storyController.viewStory);
router.delete('/:id', authenticate, storyController.deleteStory);

export default router;
