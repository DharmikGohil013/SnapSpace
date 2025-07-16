const Tile = require('../models/Tile');
const { MESSAGES } = require('../config/constants');

// @desc    Get all tiles with filtering and pagination
// @route   GET /api/tiles
// @access  Public
const getTiles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build query object
    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const tiles = await Tile.find(query)
      .populate('createdBy', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Tile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tiles.length,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      data: tiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single tile by ID
// @route   GET /api/tiles/:id
// @access  Public
const getTile = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!tile || !tile.isActive) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }

    res.status(200).json({
      success: true,
      data: tile
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get tiles by category
// @route   GET /api/tiles/category/:category
// @access  Public
const getTilesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const tiles = await Tile.find({ 
      category: category.toLowerCase(), 
      isActive: true 
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

    const total = await Tile.countDocuments({ 
      category: category.toLowerCase(), 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: tiles.length,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      data: tiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured tiles
// @route   GET /api/tiles/featured
// @access  Public
const getFeaturedTiles = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const tiles = await Tile.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: tiles.length,
      data: tiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search tiles
// @route   GET /api/tiles/search
// @access  Public
const searchTiles = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const tiles = await Tile.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'specifications.material': { $regex: q, $options: 'i' } },
            { 'specifications.color': { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    })
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

    const total = await Tile.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'specifications.material': { $regex: q, $options: 'i' } },
            { 'specifications.color': { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: tiles.length,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      data: tiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTiles,
  getTile,
  getTilesByCategory,
  getFeaturedTiles,
  searchTiles
};
