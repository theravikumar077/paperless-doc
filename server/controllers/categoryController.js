const Category = require('../models/Category');
const Document = require('../models/Document');

const SYSTEM_CATEGORIES = [
  { name: 'Education', icon: 'graduation-cap', color: '#4f46e5' },
  { name: 'Identity', icon: 'id-card', color: '#0284c7' },
  { name: 'Medical', icon: 'heart-pulse', color: '#e11d48' },
  { name: 'Career', icon: 'briefcase', color: '#d97706' },
  { name: 'Financial', icon: 'credit-card', color: '#059669' },
  { name: 'Other', icon: 'folder', color: '#6b7280' },
];

// @desc    Get all categories for authenticated user (with document count per category)
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get document counts per category for this user
    const countsAggregation = await Document.aggregate([
      { $match: { userId: req.user._id, deletedAt: null } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    countsAggregation.forEach((item) => {
      countMap[item._id] = item.count;
    });

    // Get custom user categories
    const customCategories = await Category.find({ userId });

    const systemCatsFormatted = SYSTEM_CATEGORIES.map((cat) => ({
      ...cat,
      isSystem: true,
      count: countMap[cat.name] || 0,
    }));

    const customCatsFormatted = customCategories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      isSystem: false,
      count: countMap[cat.name] || 0,
    }));

    res.status(200).json({
      success: true,
      data: [...systemCatsFormatted, ...customCatsFormatted],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create custom category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    const trimmedName = name.trim();

    // Check if system or custom category with same name exists
    if (SYSTEM_CATEGORIES.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'A standard category with this name already exists',
      });
    }

    const existing = await Category.findOne({
      userId: req.user.id,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Custom category already exists',
      });
    }

    const category = await Category.create({
      userId: req.user.id,
      name: trimmedName,
      icon: icon || 'folder',
      color: color || '#6366f1',
      isSystem: false,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    if (category.isSystem) {
      return res.status(400).json({
        success: false,
        message: 'System categories cannot be deleted',
      });
    }

    // Move any documents in this custom category to 'Other'
    await Document.updateMany(
      { userId: req.user.id, category: category.name },
      { $set: { category: 'Other' } }
    );

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: 'Category deleted and affected documents moved to Other',
    });
  } catch (error) {
    next(error);
  }
};
