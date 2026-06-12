const ServiceCategory = require('../models/ServiceCategory');

// @desc    Get all service categories (Public)
// @route   GET /api/services
const getAllServices = async (req, res) => {
  try {
    const services = await ServiceCategory.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new service category (Admin)
// @route   POST /api/services
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, icon, color } = req.body;

    const service = new ServiceCategory({
      name,
      description,
      price,
      duration,
      icon,
      color
    });

    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a service category (Admin)
// @route   PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a service category (Admin)
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
