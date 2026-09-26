import express from 'express';
import { getProfile, updateProfile, followUser, getSuggestedUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/follow/:id', authenticate, followUser);
router.get('/suggested', authenticate, getSuggestedUsers);

export default router;
