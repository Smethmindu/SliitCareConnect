import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from '../controllers/messageController.js';

const router = express.Router();

// All message routes require authentication
router.post('/conversations', authenticate, getOrCreateConversation);
router.get('/conversations/:userId', authenticate, getConversations);
router.get('/:conversationId/messages', authenticate, getMessages);
router.post('/send', authenticate, sendMessage);
router.patch('/read/:conversationId', authenticate, markAsRead);

export default router;
