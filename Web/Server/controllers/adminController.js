const Tile = require('../models/Tile');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { MESSAGES, USER_ROLES } = require('../config/constants');

// @desc    Create new tile
// @route   POST /api/admin/tiles
// @access  Private/Admin
const createTile = async (req, res) => {
  try {
    const tileData = {
      ...req.body,
      createdBy: req.user.id
    };

    const tile = await Tile.create(tileData);

    await tile.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Tile created successfully',
      data: tile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update tile
// @route   PUT /api/admin/tiles/:id
// @access  Private/Admin
const updateTile = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (!tile) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }

    const updatedTile = await Tile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Tile updated successfully',
      data: updatedTile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete tile
// @route   DELETE /api/admin/tiles/:id
// @access  Private/Admin
const deleteTile = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (!tile) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }

    // Soft delete - set isActive to false
    tile.isActive = false;
    await tile.save();

    res.status(200).json({
      success: true,
      message: 'Tile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all tiles (including inactive) for admin
// @route   GET /api/admin/tiles
// @access  Private/Admin
const getAllTilesAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = {};

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tiles = await Tile.find(query)
      .populate('createdBy', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

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

// @desc    Toggle tile featured status
// @route   PATCH /api/admin/tiles/:id/featured
// @access  Private/Admin
const toggleFeatured = async (req, res) => {
  try {
    const tile = await Tile.findById(req.params.id);

    if (!tile) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }

    tile.isFeatured = !tile.isFeatured;
    await tile.save();

    res.status(200).json({
      success: true,
      message: `Tile ${tile.isFeatured ? 'added to' : 'removed from'} featured`,
      data: tile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isVerified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalTiles = await Tile.countDocuments();
    const activeTiles = await Tile.countDocuments({ isActive: true });
    const featuredTiles = await Tile.countDocuments({ isFeatured: true, isActive: true });
    
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: USER_ROLES.ADMIN });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    
    const totalCarts = await Cart.countDocuments();
    const cartsWithItems = await Cart.countDocuments({ totalItems: { $gt: 0 } });

    // Recent tiles (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentTiles = await Tile.countDocuments({ 
      createdAt: { $gte: lastWeek },
      isActive: true 
    });

    // Recent users (last 7 days)
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: lastWeek } 
    });

    res.status(200).json({
      success: true,
      data: {
        tiles: {
          total: totalTiles,
          active: activeTiles,
          featured: featuredTiles,
          recent: recentTiles
        },
        users: {
          total: totalUsers,
          admins: adminUsers,
          verified: verifiedUsers,
          recent: recentUsers
        },
        carts: {
          total: totalCarts,
          withItems: cartsWithItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTile,
  updateTile,
  deleteTile,
  getAllTilesAdmin,
  toggleFeatured,
  getAllUsers,
  updateUserRole,
  getDashboardStats
};
