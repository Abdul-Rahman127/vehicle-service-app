const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: { type: String, default: 'Admin', trim: true },
  lastName: { type: String, default: 'DriveX', trim: true },
  email: { type: String, default: 'admin@drivex.lk', trim: true },
  phone: { type: String, default: '+94 77 123 4567', trim: true },
  role: { type: String, default: 'Super Administrator' },
  profilePhoto: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
