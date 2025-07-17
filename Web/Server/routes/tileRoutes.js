// routes/tileRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllTiles,
  getTileById,
  searchTiles,
} = require('../controllers/tileController');

const { protect } = require('../middlewares/auth');

// Public route to get all tiles
router.get('/', getAllTiles);

// Get specific tile by ID
router.get('/:id', getTileById);

// Optional: search by name/category/usage
router.get('/search/query', searchTiles);

module.exports = router;
