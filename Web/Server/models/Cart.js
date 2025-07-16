const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  tile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tile',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
  this.lastUpdated = new Date();
  next();
});

// Static method to calculate item total price
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
