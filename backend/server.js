// DriveX Vehicle Service Booking System - Backend Server v3.0
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { uploadsDir, imagesDir } = require('./utils/fileStorage');

dotenv.config();

const app = express();

// ─── CORS: Set headers on EVERY response (before anything else) ────────────
app.use(function (req, res, next) {
  // Set CORS headers unconditionally for all vercel.app origins and localhost
  const origin = req.headers.origin;
  if (origin && (/\.vercel\.app$/.test(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // No origin header (Postman, curl, server-to-server) - allow
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight 24 hours

  // Immediately respond to preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log(`[PREFLIGHT] ${req.headers.origin} → ${req.path}`);
    return res.sendStatus(200);
  }
  next();
});

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));

// ─── Static Files ──────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));

// ─── Request Logger ────────────────────────────────────────────────────────
app.use(function (req, res, next) {
  console.log(`[${req.method}] ${req.path} — Origin: ${req.headers.origin || 'none'}`);
  next();
});

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
    version: '3.0.0',
  });
});

// ─── Error Handler (also sets CORS so errors don't block the browser) ──────
app.use(function (err, req, res, next) {
  console.error('[ERROR]', err.message);
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  DriveX API v3.0.0`);
    console.log(`  Port:    ${PORT}`);
    console.log(`  Env:     ${process.env.NODE_ENV || 'development'}`);
    console.log(`  CORS:    manual headers (all *.vercel.app)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
