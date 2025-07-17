// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const {
  getUserCart,
  addTileToCart,
  removeTileFromCart,
  clearCart,
} = require('../controllers/cartController');

const { protect } = require('../middlewares/auth');

// User Cart Routes
router.get('/', protect, getUserCart);
router.post('/add', protect, addTileToCart);
router.delete('/remove/:tileId', protect, removeTileFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
