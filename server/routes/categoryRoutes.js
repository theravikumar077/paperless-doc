const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.use(protect);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
