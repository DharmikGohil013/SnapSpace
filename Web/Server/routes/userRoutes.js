// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const { protect } = require('../middlewares/auth');

// Get user's own profile
router.get('/profile', protect, getUserProfile);

// Update user's profile (e.g., name)
router.put('/profile', protect, updateUserProfile);

module.exports = router;
