import Notification from '../models/Notification.js';

// GET /api/notifications/:userId — Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.params.userId }).sort({
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
