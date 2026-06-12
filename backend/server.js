const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { uploadsDir, imagesDir } = require('./utils/fileStorage');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '3mb' }));

// Static file serving — uploads and bundled images
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check route
app.get('/', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    message: 'DriveX API is running',
    mongodb: dbState[require('mongoose').connection.readyState] || 'unknown'
  });
});

// Connect to MongoDB, then start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
