// routes/tileRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllTiles,
  getTileById,
  searchTiles,
} = require('../controllers/tileController');

const { protect } = require('../middlewares/auth');
const { logTileView, logCustomInteraction } = require('../middlewares/analyticsLogger');

// Public route to get all tiles (with optional analytics logging for authenticated users)
router.get('/', logCustomInteraction, getAllTiles);

// Get specific tile by ID (with view logging for authenticated users)
router.get('/:id', logCustomInteraction, logTileView, getTileById);

// Optional: search by name/category/usage
router.get('/search/query', logCustomInteraction, searchTiles);

module.exports = router;
