const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { saveBase64Image, deleteUploadedFile } = require('../utils/fileStorage');

const getPhotoUrl = (photoPath, req) => {
  if (!photoPath) return '';
  if (photoPath.startsWith('data:') || photoPath.startsWith('http')) return photoPath;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}${photoPath}`;
};

const formatUser = (user, req) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  if (obj.profilePhoto && !obj.profilePhoto.startsWith('data:') && !obj.profilePhoto.startsWith('http')) {
    obj.profilePhoto = getPhotoUrl(obj.profilePhoto, req);
  }
  return obj;
};

// @desc    Login admin user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: getPhotoUrl(user.profilePhoto, req)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(formatUser(user, req));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload profile photo (base64 → saved to /uploads)
// @route   PUT /api/auth/profile/photo
const updateProfilePhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      return res.status(400).json({ message: 'No photo provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let photoPath = profilePhoto;

    if (profilePhoto.startsWith('data:image')) {
      if (profilePhoto.length > 3 * 1024 * 1024) {
        return res.status(400).json({ message: 'Photo must be under 2MB' });
      }
      deleteUploadedFile(user.profilePhoto);
      photoPath = saveBase64Image(profilePhoto, `profile-${user._id}`);
      if (!photoPath) {
        return res.status(400).json({ message: 'Invalid image format' });
      }
    }

    user.profilePhoto = photoPath;
    await user.save();

    res.json({
      message: 'Profile photo updated successfully',
      user: formatUser(user, req)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getProfile, updateProfile, updateProfilePhoto, changePassword };
