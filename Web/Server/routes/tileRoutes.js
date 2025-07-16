const express = require('express');
const {
  getTiles,
  getTile,
  getTilesByCategory,
  getFeaturedTiles,
  searchTiles
} = require('../controllers/tileController');
const { optionalAuth } = require('../middlewares/auth');

const router = express.Router();

// Public routes with optional auth for user-specific features
router.get('/', optionalAuth, getTiles);
router.get('/featured', optionalAuth, getFeaturedTiles);
router.get('/search', optionalAuth, searchTiles);
router.get('/category/:category', optionalAuth, getTilesByCategory);
router.get('/:id', optionalAuth, getTile);

module.exports = router;
