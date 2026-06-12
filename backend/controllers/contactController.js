const ContactMessage = require('../models/ContactMessage');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Submit contact form (Public)
// @route   POST /api/contact
const submitContact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contactMessage = await ContactMessage.create({
      name, phone, email, subject, message
    });

    await createNotification({
      type: 'contact',
      title: 'New Contact Message',
      message: `${name} sent: ${subject}`,
      link: '/admin/messages',
      referenceId: contactMessage._id.toString()
    });

    res.status(201).json({ message: 'Message sent successfully', contactMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
const getContactMessages = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status === 'read') filter.isRead = true;
    if (status === 'unread') filter.isRead = false;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ messages, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update message read status (Admin)
// @route   PUT /api/contact/:id/read
const updateReadStatus = async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: Boolean(isRead) },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Status updated', contactMessage: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitContact, getContactMessages, updateReadStatus, deleteContactMessage };
