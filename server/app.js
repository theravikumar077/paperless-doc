const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Startup Environment Variable Validation
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingRequired = requiredEnvVars.filter((key) => !process.env[key]);
if (missingRequired.length > 0) {
  console.error(`[Server Config Error] Missing critical environment variables: ${missingRequired.join(', ')}`);
}

const googleEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'];
const missingGoogle = googleEnvVars.filter((key) => !process.env[key]);
if (missingGoogle.length > 0) {
  console.warn(`[Server Config Warning] Google OAuth configuration is incomplete. Missing: ${missingGoogle.join(', ')}`);
} else {
  console.log(`[Google OAuth Config] Client ID Configured: ${!!process.env.GOOGLE_CLIENT_ID}`);
  console.log(`[Google OAuth Config] Client Secret Configured: ${!!process.env.GOOGLE_CLIENT_SECRET}`);
  console.log(`[Google OAuth Config] Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
  console.log(`[Google OAuth Config] Client URL: ${process.env.CLIENT_URL}`);
}

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const shareRoutes = require('./routes/shareRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to MongoDB Atlas (cached in serverless)
connectDB();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration supporting production & localhost
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === process.env.CLIENT_URL ||
        origin.includes('vercel.app') ||
        origin.includes('localhost')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PaperlessDoc API Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
