const Settings = require('../models/Settings');
const User = require('../models/User');
const Booking = require('../models/Booking');
const ServiceCategory = require('../models/ServiceCategory');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: 'app' });
  if (!settings) {
    settings = await Settings.create({ key: 'app' });
  }
  return settings;
};

// @desc    Get public settings (business info + working hours)
// @route   GET /api/settings/public
const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      businessInfo: settings.businessInfo,
      workingHours: settings.workingHours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all settings (Admin)
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update settings section (Admin)
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const { section, data } = req.body;
    const settings = await getOrCreateSettings();

    const allowed = ['businessInfo', 'workingHours', 'notifications', 'bookingSettings'];
    if (!allowed.includes(section)) {
      return res.status(400).json({ message: 'Invalid settings section' });
    }

    settings[section] = data;
    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Danger zone actions (Admin)
// @route   POST /api/settings/danger
const dangerZoneAction = async (req, res) => {
  try {
    const { action, confirmText, password } = req.body;

    if (confirmText !== 'DELETE') {
      return res.status(400).json({ message: 'Confirmation text must be DELETE' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    switch (action) {
      case 'deleteBookings':
        await Booking.deleteMany({});
        await mongoose.connection.collection('counters').deleteMany({});
        return res.json({ message: 'All bookings deleted successfully' });

      case 'deleteServices':
        await ServiceCategory.deleteMany({});
        return res.json({ message: 'All service categories deleted successfully' });

      case 'resetData':
        await Booking.deleteMany({});
        await ServiceCategory.deleteMany({});
        await mongoose.connection.collection('counters').deleteMany({});
        return res.json({ message: 'All bookings and services reset successfully' });

      case 'deleteAccount':
        await User.findByIdAndDelete(req.user.id);
        return res.json({ message: 'Admin account deleted successfully' });

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPublicSettings, getSettings, updateSettings, dangerZoneAction };
