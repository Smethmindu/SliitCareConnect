import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendBroadcast,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', authenticate, getNotifications);
router.patch('/markAllRead/:userId', authenticate, markAllAsRead);
router.patch('/:id/read', authenticate, markAsRead);
router.post('/broadcast', authenticate, authorize('admin'), sendBroadcast);

export default router;
