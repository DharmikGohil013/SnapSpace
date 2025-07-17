// controllers/cartController.js

const User = require('../models/User');
const Tile = require('../models/Tile');
const { MESSAGES } = require('../config/constants');

// GET /api/cart
exports.getUserCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.tile');
  res.json({ success: true, cart: user.cart });
};

// POST /api/cart/add
exports.addTileToCart = async (req, res) => {
  const { tileId } = req.body;

  const tile = await Tile.findById(tileId);
  if (!tile) return res.status(404).json({ success: false, message: 'Tile not found' });

  const user = await User.findById(req.user._id);

  const alreadyInCart = user.cart.some((item) => item.tile.toString() === tileId);
  if (alreadyInCart) {
    return res.status(400).json({ success: false, message: 'Tile already in cart' });
  }

  user.cart.push({ tile: tileId });
  await user.save();

  res.status(201).json({ success: true, message: 'Tile added to cart' });
};

// DELETE /api/cart/remove/:tileId
exports.removeTileFromCart = async (req, res) => {
  const { tileId } = req.params;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((item) => item.tile.toString() !== tileId);
  await user.save();

  res.json({ success: true, message: 'Tile removed from cart' });
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ success: true, message: 'Cart cleared' });
};
