// controllers/contactController.js
const Contact = require('../models/Contact');

// POST /api/contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving contact', error: error.message });
  }
};

// GET /api/contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contacts', error: error.message });
  }
};
