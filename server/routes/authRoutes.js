const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleAuth,
  getMe,
  completeOnboarding,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/onboarding', protect, completeOnboarding);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
