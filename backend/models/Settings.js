const mongoose = require('mongoose');

const dayScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  open: { type: String, default: '8:00 AM' },
  close: { type: String, default: '6:00 PM' },
  closed: { type: Boolean, default: false }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'app', unique: true },
  businessInfo: {
    name: { type: String, default: 'DriveX Vehicle Services' },
    address: { type: String, default: 'Peradeniya Road' },
    city: { type: String, default: 'Kandy' },
    country: { type: String, default: 'Sri Lanka' },
    phone: { type: String, default: '+94 77 123 4567' },
    email: { type: String, default: 'info@drivex.lk' },
    website: { type: String, default: 'www.drivex.lk' },
    description: { type: String, default: 'Professional vehicle servicing in Kandy, Sri Lanka.' }
  },
  workingHours: {
    type: [dayScheduleSchema],
    default: [
      { day: 'Monday', open: '8:00 AM', close: '6:00 PM', closed: false },
      { day: 'Tuesday', open: '8:00 AM', close: '6:00 PM', closed: false },
      { day: 'Wednesday', open: '8:00 AM', close: '6:00 PM', closed: false },
      { day: 'Thursday', open: '8:00 AM', close: '6:00 PM', closed: false },
      { day: 'Friday', open: '8:00 AM', close: '6:00 PM', closed: false },
      { day: 'Saturday', open: '8:00 AM', close: '4:00 PM', closed: false },
      { day: 'Sunday', open: 'Closed', close: 'Closed', closed: true }
    ]
  },
  notifications: {
    emailBookings: { type: Boolean, default: true },
    emailReminders: { type: Boolean, default: true },
    smsBookings: { type: Boolean, default: false },
    smsReminders: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true }
  },
  bookingSettings: {
    slotDuration: { type: Number, default: 30 },
    maxDailyBookings: { type: Number, default: 20 },
    autoApprove: { type: Boolean, default: false },
    advanceBookingDays: { type: Number, default: 30 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
