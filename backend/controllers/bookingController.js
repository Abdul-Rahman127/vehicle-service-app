const Booking = require('../models/Booking');
const ServiceCategory = require('../models/ServiceCategory');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create a new booking (Customer)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { customerName, phone, vehicleNumber, vehicleType, serviceType, date, time, notes } = req.body;

    const booking = new Booking({
      customerName,
      phone,
      vehicleNumber,
      vehicleType,
      serviceType,
      date,
      time,
      notes
    });

    await booking.save();

    await createNotification({
      type: 'booking',
      title: 'New Booking Request',
      message: `${customerName} booked ${serviceType} for ${date}`,
      link: '/admin/pending',
      referenceId: booking._id.toString()
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings (Admin) - with optional filters
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, search, service, page = 1, limit = 10 } = req.query;
    let filter = {};

    // Filter by status
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Filter by service type
    if (service && service !== 'All Services') {
      filter.serviceType = service;
    }

    // Search by name, vehicle, or service
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { vehicleNumber: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a booking (Admin)
// @route   DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking statistics (Admin Dashboard)
// @route   GET /api/bookings/stats
const getBookingStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const approved = await Booking.countDocuments({ status: 'Approved' });
    const completed = await Booking.countDocuments({ status: 'Completed' });
    const rejected = await Booking.countDocuments({ status: 'Rejected' });

    const serviceStats = await Booking.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const completedServiceStats = await Booking.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    const now = new Date();
    let daysBack = 30;
    if (period === 'week') daysBack = 7;
    if (period === 'year') daysBack = 365;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setHours(0, 0, 0, 0);

    const dailyStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ratedBookings = await Booking.find({ rating: { $exists: true, $ne: null } });
    const avgRating = ratedBookings.length
      ? ratedBookings.reduce((sum, b) => sum + b.rating, 0) / ratedBookings.length
      : 0;
    const satisfactionPercent = ratedBookings.length
      ? Math.round((ratedBookings.filter((b) => b.rating >= 4).length / ratedBookings.length) * 100)
      : 0;

    const completedWithRating = await Booking.find({
      status: 'Completed',
      rating: { $exists: true, $ne: null }
    });

    const services = await ServiceCategory.find();
    const priceMap = {};
    services.forEach((s) => { priceMap[s.name] = s.price || 0; });

    const completedBookings = await Booking.find({ status: 'Completed' });
    const estimatedRevenue = completedBookings.reduce(
      (sum, b) => sum + (priceMap[b.serviceType] || 4500),
      0
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const completedToday = await Booking.countDocuments({
      status: 'Completed',
      updatedAt: { $gte: todayStart }
    });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const bookingsThisWeek = await Booking.countDocuments({ createdAt: { $gte: weekStart } });

    const prevWeekStart = new Date();
    prevWeekStart.setDate(prevWeekStart.getDate() - 14);
    const bookingsPrevWeek = await Booking.countDocuments({
      createdAt: { $gte: prevWeekStart, $lt: weekStart }
    });

    const calcTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySummary = monthlyStats.map((m, i) => {
      const prev = monthlyStats[i + 1];
      const trend = prev ? calcTrend(m.total, prev.total) : 0;
      return {
        month: monthNames[m._id.month - 1],
        year: m._id.year,
        total: m.total,
        completed: m.completed,
        trend
      };
    });

    const serviceCount = await ServiceCategory.countDocuments({ isActive: true });

    res.json({
      total,
      pending,
      approved,
      completed,
      rejected,
      serviceStats,
      completedServiceStats,
      recentBookings,
      monthlyStats: monthlySummary,
      dailyStats,
      avgRating: Math.round(avgRating * 10) / 10,
      satisfactionPercent,
      ratedCount: ratedBookings.length,
      completedRatedCount: completedWithRating.length,
      estimatedRevenue,
      completedToday,
      bookingsThisWeek,
      bookingsWeekTrend: calcTrend(bookingsThisWeek, bookingsPrevWeek),
      serviceCount,
      publicStats: {
        totalCompleted: completed,
        satisfactionPercent: satisfactionPercent || (completed > 0 ? 98 : 0),
        serviceCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get public stats for marketing pages
// @route   GET /api/bookings/public-stats
const getPublicStats = async (req, res) => {
  try {
    const completed = await Booking.countDocuments({ status: 'Completed' });
    const serviceCount = await ServiceCategory.countDocuments({ isActive: true });
    const rated = await Booking.find({ rating: { $exists: true, $ne: null } });
    const satisfaction = rated.length
      ? Math.round((rated.filter((b) => b.rating >= 4).length / rated.length) * 100)
      : 98;

    res.json({
      totalCompleted: completed,
      satisfactionPercent: satisfaction,
      serviceCount: serviceCount || 6
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
  getPublicStats
};
