import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  getProfile,
  getSuggestedUsers,
  searchUsers,
  toggleFollow,
  handleFollowRequest,
  listFollowRequests,
  updateProfile,
  getFeed,
  getNotifications
} from '../controllers/userController.js';

const router = express.Router();

router.get('/feed', authenticate, getFeed);
router.get('/suggested', authenticate, getSuggestedUsers);
router.get('/search', authenticate, searchUsers);
router.get('/requests', authenticate, listFollowRequests);
router.get('/:id/profile', authenticate, getProfile);
router.post('/follow/:id', authenticate, toggleFollow);
router.post('/follow-request/:id', authenticate, handleFollowRequest);
router.put('/profile', authenticate, updateProfile);
router.get('/notifications', authenticate, getNotifications);

export default router;
