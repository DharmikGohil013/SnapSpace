// routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const {
  logInteraction,
  addFeedback,
  getTileAnalytics,
  getAllAnalytics,
  getWeeklyTrends,
  getTopPerformingTiles,
  getUserEngagement,
  deleteAnalytics
} = require('../controllers/analyticsController');

const { protect, isAdmin } = require('../middlewares/auth');

// User routes (authenticated users)
router.post('/interactions', protect, logInteraction);
router.post('/feedback', protect, addFeedback);

// Admin-only routes
router.get('/tiles', protect, isAdmin, getAllAnalytics);
router.get('/tiles/:tileId', protect, isAdmin, getTileAnalytics);
router.get('/tiles/:tileId/trends', protect, isAdmin, getWeeklyTrends);
router.get('/tiles/:tileId/engagement', protect, isAdmin, getUserEngagement);
router.get('/top-performing', protect, isAdmin, getTopPerformingTiles);
router.delete('/tiles/:tileId', protect, isAdmin, deleteAnalytics);

module.exports = router;
// Create this route in your analyticsRoutes.js for testing
router.post('/seed-data', protect, isAdmin, async (req, res) => {
  try {
    const sampleData = [/* paste JSON array above */];
    await TileAnalysis.insertMany(sampleData);
    res.json({ success: true, message: 'Sample data created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});