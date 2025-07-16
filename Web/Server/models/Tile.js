const mongoose = require('mongoose');
const { TILE_CATEGORIES } = require('../config/constants');

const tileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tile name is required'],
    trim: true,
    maxlength: [100, 'Tile name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: Object.values(TILE_CATEGORIES)
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than original price'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String
  }],
  specifications: {
    size: {
      length: Number,
      width: Number,
      thickness: Number,
      unit: {
        type: String,
        default: 'mm'
      }
    },
    material: String,
    finish: String,
    color: String,
    pattern: String,
    usage: [String] // e.g., ['floor', 'wall', 'outdoor']
  },
  inventory: {
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      enum: ['pieces', 'sqft', 'sqm', 'boxes'],
      default: 'pieces'
    },
    lowStockAlert: {
      type: Number,
      default: 10
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search optimization
tileSchema.index({
  name: 'text',
  description: 'text',
  'specifications.material': 'text',
  'specifications.color': 'text'
});

// Index for filtering
tileSchema.index({ category: 1, price: 1 });
tileSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Tile', tileSchema);
