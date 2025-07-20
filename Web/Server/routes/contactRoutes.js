// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');

// Public routes (no token required)
router.post('/', createContact);
router.get('/', getContacts);

module.exports = router;
