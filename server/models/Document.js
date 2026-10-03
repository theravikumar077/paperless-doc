const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a document name'],
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // e.g. 'application/pdf', 'image/png', 'image/jpeg', 'image/webp'
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      default: 'Other',
      index: true,
    },
    issueDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isImportant: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user queries
documentSchema.index({ userId: 1, deletedAt: 1, createdAt: -1 });
documentSchema.index({ userId: 1, category: 1, deletedAt: 1 });
documentSchema.index({ userId: 1, isImportant: 1, deletedAt: 1 });

module.exports = mongoose.model('Document', documentSchema);
