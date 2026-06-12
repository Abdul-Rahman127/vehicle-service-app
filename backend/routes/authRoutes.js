const express = require('express');
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile,
  updateProfilePhoto,
  changePassword
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/profile/photo', auth, updateProfilePhoto);
router.put('/change-password', auth, changePassword);

module.exports = router;
