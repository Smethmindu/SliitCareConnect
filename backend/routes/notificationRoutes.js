import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getNotifications);
router.patch('/markAllRead/:userId', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
