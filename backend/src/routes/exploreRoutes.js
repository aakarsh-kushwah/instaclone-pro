import express from 'express';
import { search, trendingTags } from '../controllers/exploreController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authenticate, search);
router.get('/tags', authenticate, trendingTags);

export default router;
