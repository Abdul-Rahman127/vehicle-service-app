// DriveX Vehicle Service Booking System - Backend Server
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { uploadsDir, imagesDir } = require('./utils/fileStorage');

dotenv.config();

const app = express();

// ─── CORS — manual headers (works for all vercel.app subdomains) ────────────
app.use(function (req, res, next) {
  const origin = req.headers.origin;

  // Allow any *.vercel.app subdomain and localhost
  if (
    !origin ||
    /\.vercel\.app$/.test(origin) ||
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));

// ─── Static Files ──────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/bookings',      require('./routes/bookingRoutes'));
app.use('/api/services',      require('./routes/serviceRoutes'));
app.use('/api/settings',      require('./routes/settingsRoutes'));
app.use('/api/contact',       require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    message: 'DriveX API is running',
    mongodb: dbStates[require('mongoose').connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Version: 2.0.0 - manual CORS headers`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
