const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPublicSettings,
  getSettings,
  updateSettings,
  dangerZoneAction
} = require('../controllers/settingsController');

router.get('/public', getPublicSettings);
router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);
router.post('/danger', auth, dangerZoneAction);

module.exports = router;
