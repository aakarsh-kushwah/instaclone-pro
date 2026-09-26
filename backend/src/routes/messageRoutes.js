import express from 'express';
import authenticate from '../middleware/authenticate.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

router.post('/', authenticate, messageController.sendMessage);
router.get('/:userId', authenticate, messageController.getConversation);
router.get('/', authenticate, messageController.getConversations);

export default router;
