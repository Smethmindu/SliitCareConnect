import Notification from '../models/Notification.js';
import { User } from '../models/User.js';

// GET /api/notifications/:userId — Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;

    // Fetch the user to determine their role
    const requestingUser = await User.findById(requestedUserId).select('role');

    let filter = { recipientId: requestedUserId };

    // Only admins should see new_signup notifications
    if (!requestingUser || requestingUser.role !== 'admin') {
      filter.type = { $ne: 'new_signup' };
    }

    const notifications = await Notification.find(filter).sort({
      isRead: 1,
      createdAt: -1,
    });
    res.status(200).json({ status: 'success', data: notifications });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/notifications/:id/read — Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ status: 'error', message: 'Notification not found.' });
    }
    res.status(200).json({ status: 'success', data: notification });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/notifications/markAllRead/:userId — Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.params.userId, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ status: 'success', message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/notifications/broadcast — Admin sends notification to users
export const sendBroadcast = async (req, res) => {
  try {
    const { message, target } = req.body; // target: 'all' | 'students' | 'counselors'

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message is required.' });
    }

    // Build query based on target
    let query = {};
    if (target === 'students') query.role = 'student';
    else if (target === 'counselors') query.role = 'counselor';
    // 'all' = no filter (gets students + counselors, not admins)
    else query.role = { $in: ['student', 'counselor'] };

    const users = await User.find(query).select('_id');

    const notifications = users.map((user) => ({
      recipientId: user._id.toString(),
      type: 'admin_broadcast',
      message,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      status: 'success',
      message: `Notification sent to ${notifications.length} users.`,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

