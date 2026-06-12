const Notification = require('../models/Notification');

const createNotification = async ({ type, title, message, link = '', referenceId = '' }) => {
  try {
    await Notification.create({ type, title, message, link, referenceId });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { createNotification };
