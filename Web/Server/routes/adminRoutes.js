const express = require('express');
const router = express.Router();
const {
  createTile,
  getAllUsers,
  getAllTiles, // Add this import
  deleteTile,
  updateTile,
  deleteUser,
} = require('../controllers/authController');

const { protect, isAdmin } = require('../middlewares/auth');
const { requestOtp, verifyOtpAndRegister } = require('../controllers/authController');

// Admin-only routes
router.post('/tiles', protect, isAdmin, createTile);
router.get('/tiles', protect, isAdmin, getAllTiles); // Add this route
router.put('/tiles/:id', protect, isAdmin, updateTile);
router.delete('/tiles/:id', protect, isAdmin, deleteTile);
router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);

module.exports = router;