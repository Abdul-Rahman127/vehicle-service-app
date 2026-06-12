const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getPublicStats
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/public-stats', getPublicStats);
router.get('/stats', auth, getBookingStats);

// POST /api/bookings (Public - customer creates booking)
router.post('/', createBooking);

// GET /api/bookings (Admin - get all bookings)
router.get('/', auth, getAllBookings);

// GET /api/bookings/:id (Admin - get single booking)
router.get('/:id', auth, getBookingById);

// PUT /api/bookings/:id/status (Admin - update status)
router.put('/:id/status', auth, updateBookingStatus);

// DELETE /api/bookings/:id (Admin - delete booking)
router.delete('/:id', auth, deleteBooking);

module.exports = router;
