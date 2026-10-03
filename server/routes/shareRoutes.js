const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createShareLink,
  getUserShareLinks,
  getPublicShareInfo,
  downloadSharedFile,
  revokeShareLink,
} = require('../controllers/shareController');

// Public routes for viewing shared docs
router.get('/public/:token', getPublicShareInfo);
router.get('/public/:token/download', downloadSharedFile);

// Protected routes for managing user's share links
router.use(protect);
router.post('/create', createShareLink);
router.get('/', getUserShareLinks);
router.patch('/:id/revoke', revokeShareLink);

module.exports = router;
