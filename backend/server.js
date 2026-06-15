// DriveX Vehicle Service Booking System - Backend Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { uploadsDir, imagesDir } = require('./utils/fileStorage');

dotenv.config();

const app = express();

// ─── CORS Configuration ────────────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, Postman)
    if (!origin) return callback(null, true);
    // Allow any Vercel subdomain (covers ALL preview + production deployments)
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow localhost / 127.0.0.1 for local dev
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Apply CORS to every request
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS for ALL routes with same config
app.options('*', cors(corsOptions));

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
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
