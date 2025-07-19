// models/Tile.js

const mongoose = require('mongoose');
const { TILE_CATEGORIES } = require('../config/constants');

// Function to generate unique 5-character alphanumeric ID
const generateTileId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const tileSchema = new mongoose.Schema({
  tileId: {
    type: String,
    unique: true,
    default: generateTileId,
    required: true,
    uppercase: true,
    maxlength: 5,
    minlength: 5,
  },
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
  company: {
    type: String,
    required: [true, 'Company name is required'],
    default: '',
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
  likes: {
    count: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      likedAt: {
        type: Date,
        default: Date.now,
      }
    }]
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

// Pre-save middleware to ensure unique tileId
tileSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('tileId')) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      try {
        this.tileId = generateTileId();
        const existingTile = await mongoose.model('Tile').findOne({ tileId: this.tileId });
        if (!existingTile) {
          isUnique = true;
        }
        attempts++;
      } catch (error) {
        return next(error);
      }
    }
    
    if (!isUnique) {
      return next(new Error('Could not generate unique tile ID after multiple attempts'));
    }
  }
  next();
});

// Pre-save middleware to update likes count
tileSchema.pre('save', function(next) {
  if (this.likes && this.likes.likedBy) {
    this.likes.count = this.likes.likedBy.length;
  }
  next();
});

module.exports = mongoose.model('Tile', tileSchema);
