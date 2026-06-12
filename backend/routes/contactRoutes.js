const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  submitContact,
  getContactMessages,
  updateReadStatus,
  deleteContactMessage
} = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', auth, getContactMessages);
router.put('/:id/read', auth, updateReadStatus);
router.delete('/:id', auth, deleteContactMessage);

module.exports = router;
