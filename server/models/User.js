const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local' && !this.googleId;
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    preferences: {
      selectedCategories: {
        type: [String],
        default: ['Education', 'Identity', 'Medical', 'Career', 'Financial', 'Other'],
      },
      expiryReminders: {
        type: Boolean,
        default: true,
      },
      smartOrganization: {
        type: Boolean,
        default: true,
      },
      secureLock: {
        type: Boolean,
        default: false,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      reminderThresholdDays: {
        type: Number,
        default: 30,
      },
    },
    storageUsed: {
      type: Number,
      default: 0, // in bytes
    },
    storageLimit: {
      type: Number,
      default: 10 * 1024 * 1024 * 1024, // 10 GB in bytes
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
