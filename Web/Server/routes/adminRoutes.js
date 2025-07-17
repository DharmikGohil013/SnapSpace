const express = require('express');
const {
  createTile,
  updateTile,
  deleteTile,
  getAllTilesAdmin,
  toggleFeatured,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/role');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Tile management
router.get('/tiles', getAllTilesAdmin);
router.post('/tiles', createTile);
router.put('/tiles/:id', updateTile);
router.delete('/tiles/:id', deleteTile);
router.patch('/tiles/:id/featured', toggleFeatured);

// User management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
