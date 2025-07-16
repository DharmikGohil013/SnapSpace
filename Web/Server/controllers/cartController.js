const Cart = require('../models/Cart');
const Tile = require('../models/Tile');
const { MESSAGES } = require('../config/constants');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.tile', 'name price discountPrice images specifications.size isActive');

    if (!cart) {
      cart = await Cart.create({ 
        user: req.user.id,
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }

    // Filter out inactive tiles
    if (cart.items.length > 0) {
      cart.items = cart.items.filter(item => item.tile && item.tile.isActive);
      if (cart.items.length !== cart.totalItems) {
        await cart.save();
      }
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { tileId, quantity = 1 } = req.body;

    // Validate tile exists and is active
    const tile = await Tile.findById(tileId);
    if (!tile || !tile.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tile not found or not available'
      });
    }

    // Check stock availability
    if (tile.inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.tile.toString() === tileId
    );

    const price = tile.discountPrice || tile.price;

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (tile.inventory.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available for this quantity'
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].totalPrice = price * newQuantity;
    } else {
      // Add new item
      cart.items.push({
        tile: tileId,
        quantity,
        price,
        totalPrice: price * quantity
      });
    }

    await cart.save();

    // Populate tile details for response
    await cart.populate('items.tile', 'name price discountPrice images specifications.size');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check tile availability and stock
    const tile = await Tile.findById(cart.items[itemIndex].tile);
    if (!tile || !tile.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tile not available'
      });
    }

    if (tile.inventory.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * quantity;

    await cart.save();

    await cart.populate('items.tile', 'name price discountPrice images specifications.size');

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    await cart.populate('items.tile', 'name price discountPrice images specifications.size');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
