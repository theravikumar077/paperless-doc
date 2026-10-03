const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  clearNotifications,
} = require('../controllers/notificationController');

router.use(protect);

router.get('/', getNotifications);
router.put('/read', markAsRead);
router.delete('/', clearNotifications);

module.exports = router;
