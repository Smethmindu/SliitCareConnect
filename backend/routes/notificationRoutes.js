import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', authenticate, getNotifications);
router.patch('/markAllRead/:userId', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);

export default router;
