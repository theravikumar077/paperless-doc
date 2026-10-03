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

// @desc    Initiate Google OAuth 2.0 flow
// @route   GET /api/auth/google
// @access  Public
exports.initiateGoogleAuth = (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error('[Google OAuth Error] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in server environment');
      return res.redirect(`${clientUrl}/login?error=google_oauth_misconfigured`);
    }

    const client = new OAuth2Client(clientId, clientSecret, callbackUrl);

    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'profile', 'email'],
      prompt: 'select_account',
    });

    res.redirect(authorizeUrl);
  } catch (error) {
    console.error('[Google OAuth Error] Failed to initiate Google auth:', error.message);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }
};

// @desc    Handle Google OAuth 2.0 callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.handleGoogleCallback = async (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  const { code, error } = req.query;

  if (error) {
    if (error === 'access_denied') {
      console.warn(
        `[Google OAuth] Authorization denied by Google/User. Callback URL: ${callbackUrl}. ` +
        `Possible causes: 1. User clicked cancel/deny. 2. App publishing status is 'Testing' in Google Cloud Console and test account is not added under Test Users.`
      );
      return res.redirect(`${clientUrl}/login?error=google_access_denied`);
    } else if (error === 'redirect_uri_mismatch') {
      console.error(`[Google OAuth Error] Redirect URI mismatch. Callback URL used: ${callbackUrl}`);
      return res.redirect(`${clientUrl}/login?error=redirect_uri_mismatch`);
    } else {
      console.error(`[Google OAuth Error] Received OAuth error parameter from Google: ${error}. Callback URL: ${callbackUrl}`);
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(error)}`);
    }
  }

  if (!code) {
    console.warn(`[Google OAuth Error] No authorization code provided in callback. Callback URL: ${callbackUrl}`);
    return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      `${req.protocol}://${req.get('host')}/api/auth/google/callback`;

    const client = new OAuth2Client(clientId, clientSecret, callbackUrl);

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    let payload;
    if (tokens.id_token) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: clientId,
        });
        payload = ticket.getPayload();
      } catch (e) {
        console.warn('Google verifyIdToken failed, decoding directly:', e.message);
        payload = jwt.decode(tokens.id_token);
      }
    }

    if (!payload || !payload.email) {
      // Fallback: request profile from userinfo API endpoint
      const userinfoRes = await client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      payload = userinfoRes.data;
    }

    if (!payload || !payload.email) {
      console.error('[Google OAuth Error] Email could not be retrieved from Google profile');
      return res.redirect(`${clientUrl}/login?error=google_email_missing`);
    }

    const email = payload.email.trim().toLowerCase();
    const googleId = payload.sub || payload.id;
    const name = payload.name || payload.given_name || email.split('@')[0];
    const picture = payload.picture || '';

    // Check if user exists by googleId OR email
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Existing user found: safely link Google ID and profile image
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    } else {
      // Create new user for Google login
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        profilePicture: picture,
        isOnboarded: false,
      });

      await Notification.create({
        userId: user._id,
        title: 'Welcome to PaperlessDoc! 🎉',
        message: 'Signed up with Google successfully. Your secure document locker is ready.',
        type: 'system',
      });
    }

    // Generate JWT token matching application's standard token format
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Redirect user to frontend callback page with the authentication token
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('[Google OAuth Callback Error]:', err);
    res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }
};

