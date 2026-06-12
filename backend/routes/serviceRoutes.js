const express = require('express');
const router = express.Router();
const {
  getAllServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// GET /api/services (Public)
router.get('/', getAllServices);

// POST /api/services (Admin)
router.post('/', auth, createService);

// PUT /api/services/:id (Admin)
router.put('/:id', auth, updateService);

// DELETE /api/services/:id (Admin)
router.delete('/:id', auth, deleteService);

module.exports = router;
