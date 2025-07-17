// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const {
  createTile,
  getAllUsers,
  deleteTile,
  updateTile,
} = require('../controllers/authController');

const { protect, isAdmin } = require('../middlewares/auth');

// Admin-only routes
router.post('/tiles', protect, isAdmin, createTile);
router.put('/tiles/:id', protect, isAdmin, updateTile);
router.delete('/tiles/:id', protect, isAdmin, deleteTile);
router.get('/users', protect, isAdmin, getAllUsers);

module.exports = router;
