// models/Tile.js

const mongoose = require('mongoose');
const { TILE_CATEGORIES } = require('../config/constants');

const tileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tile name is required'],
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: Object.values(TILE_CATEGORIES),
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inventory: {
    stock: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'pieces',
    },
  },
  specifications: {
    size: {
      length: Number,
      width: Number,
      unit: {
        type: String,
        default: 'cm',
      },
    },
    thickness: String,
    finish: String,
    material: String,
  },
  usage: [String], // e.g., ["bathroom", "kitchen"]
  isFeatured: {
    type: Boolean,
    default: false,
  },
  imageUrl: String,
  textureUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
});

module.exports = mongoose.model('Tile', tileSchema);
