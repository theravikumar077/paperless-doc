const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification(s) as read
// @route   PUT /api/notifications/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;

    if (notificationIds && Array.isArray(notificationIds)) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId: req.user.id },
        { $set: { isRead: true } }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { userId: req.user.id, isRead: false },
        { $set: { isRead: true } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
exports.clearNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All notifications cleared',
    });
  } catch (error) {
    next(error);
  }
};
