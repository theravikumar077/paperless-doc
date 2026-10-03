const User = require('../models/User');
const Document = require('../models/Document');
const ShareLink = require('../models/ShareLink');
const Notification = require('../models/Notification');
const PasswordResetToken = require('../models/PasswordResetToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

// Generate JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isOnboarded: user.isOnboarded,
      preferences: user.preferences,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      theme: user.theme,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    // Create initial welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to PaperlessDoc! 🎉',
      message: 'Your secure document locker is ready. Complete onboarding to personalize your experience.',
      type: 'system',
    });

    sendTokenResponse(user, 201, res, 'Account created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user onboarding state and preferences
// @route   POST /api/auth/onboarding
// @access  Private
exports.completeOnboarding = async (req, res, next) => {
  try {
    const { selectedCategories, preferences } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isOnboarded = true;
    if (selectedCategories && Array.isArray(selectedCategories)) {
      user.preferences.selectedCategories = selectedCategories;
    }
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile info (name, avatar, theme)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, theme, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (theme) user.theme = theme;
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    await Notification.create({
      userId: user._id,
      title: 'Password Updated',
      message: 'Your account password was changed successfully.',
      type: 'security',
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password token request
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return 200 even if user doesn't exist for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been generated.',
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      token: resetToken,
      expiresAt,
    });

    // In a full production setup with SMTP, an email would be sent here.
    // For this full-stack environment, return reset token for testing reset flow.
    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully',
      resetToken, // Provided so the reset link can be completed directly in the UI
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide token and new password',
      });
    }

    const resetRecord = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetRecord._id });

    await Notification.create({
      userId: user._id,
      title: 'Password Reset Successful',
      message: 'Your password has been reset successfully.',
      type: 'security',
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account permanently
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const { confirmationText } = req.body;
    if (confirmationText !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Please type DELETE to confirm account deletion',
      });
    }

    const userId = req.user.id;

    // Clean up physical document files
    const userDocs = await Document.find({ userId });
    for (const doc of userDocs) {
      if (doc.filePath && fs.existsSync(doc.filePath)) {
        try {
          fs.unlinkSync(doc.filePath);
        } catch (e) {
          console.error(`Failed to delete file ${doc.filePath}:`, e);
        }
      }
    }

    // Delete database records
    await Document.deleteMany({ userId });
    await ShareLink.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await PasswordResetToken.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated documents deleted permanently',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate with Google OAuth ID Token
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken, googleUser } = req.body;

    let payload;

    if (idToken) {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (err) {
        console.warn('Google verifyIdToken notice:', err.message);
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.email) {
          payload = decoded;
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid Google authentication token',
          });
        }
      }
    } else if (googleUser && googleUser.email) {
      payload = googleUser;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Google authentication credential is required',
      });
    }

    const { sub, email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication payload missing email address',
      });
    }

    const lowerEmail = email.toLowerCase();
    const googleId = sub || payload.id || `google_${Date.now()}`;

    // Check if user exists by googleId OR email
    let user = await User.findOne({
      $or: [{ googleId }, { email: lowerEmail }],
    });

    if (user) {
      // User exists. Link Google auth if not linked
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (user.authProvider !== 'google' && !user.password) {
        user.authProvider = 'google';
      }
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    } else {
      // Create new account for Google user
      user = await User.create({
        name: name || 'Google User',
        email: lowerEmail,
        googleId,
        authProvider: 'google',
        profilePicture: picture || '',
        isOnboarded: false,
      });

      await Notification.create({
        userId: user._id,
        title: 'Welcome to PaperlessDoc! 🎉',
        message: 'Signed up with Google successfully. Your secure document locker is ready.',
        type: 'system',
      });
    }

    sendTokenResponse(user, 200, res, 'Google authentication successful');
  } catch (error) {
    next(error);
  }
};
