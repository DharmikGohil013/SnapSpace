// controllers/analyticsController.js

const TileAnalysis = require('../models/TileAnalysis');
const Tile = require('../models/Tile');
const { MESSAGES } = require('../config/constants');

// Log user interaction with a tile
exports.logInteraction = async (req, res) => {
  try {
    const { 
      tileId, 
      interactionType, 
      duration = 0, 
      sessionId = '', 
      deviceInfo = {} 
    } = req.body;
    
    const userId = req.user._id;
    
    // Validate required fields
    if (!tileId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'tileId and interactionType are required'
      });
    }
    
    // Validate interaction type
    const validTypes = ['view', 'ar_view', 'ar_placement', 'like', 'unlike'];
    if (!validTypes.includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interaction type'
      });
    }
    
    // Find the tile to get ObjectId
    const tile = await Tile.findOne({ tileId });
    if (!tile) {
      return res.status(404).json({
        success: false,
        message: 'Tile not found'
      });
    }
    
    // Get or create analytics for this tile
    const analytics = await TileAnalysis.getOrCreateAnalytics(tileId, tile._id);
    
    // Log the interaction
    await analytics.logInteraction({
      userId,
      interactionType,
      duration,
      sessionId,
      deviceInfo
    });
    
    // Update weekly trends
    await analytics.updateWeeklyTrends();
    
    res.json({
      success: true,
      message: 'Interaction logged successfully',
      analytics: {
        viewCount: analytics.viewCount,
        arViewCount: analytics.arViewCount,
        arPlacementCount: analytics.arPlacementCount,
        totalLikes: analytics.totalLikes,
        engagementScore: analytics.engagementScore
      }
    });
    
  } catch (error) {
    console.error('Log interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging interaction',
      error: error.message
    });
  }
};

// Add feedback for a tile
exports.addFeedback = async (req, res) => {
  try {
    const { tileId, rating, comment = '' } = req.body;
    const userId = req.user._id;
    
    // Validate required fields
    if (!tileId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'tileId and rating are required'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Find the tile
    const tile = await Tile.findOne({ tileId });
    if (!tile) {
      return res.status(404).json({
        success: false,
        message: 'Tile not found'
      });
    }
    
    // Get or create analytics for this tile
    const analytics = await TileAnalysis.getOrCreateAnalytics(tileId, tile._id);
    
    // Add feedback
    await analytics.addFeedback({
      userId,
      rating,
      comment
    });
    
    res.json({
      success: true,
      message: 'Feedback added successfully',
      averageRating: analytics.averageRating,
      totalFeedbacks: analytics.feedbacks.length
    });
    
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

// Get analytics for a specific tile (Admin only)
exports.getTileAnalytics = async (req, res) => {
  try {
    const { tileId } = req.params;
    
    const analytics = await TileAnalysis.findOne({ tileId })
      .populate('tile', 'name category price company')
      .populate('feedbacks.userId', 'name email')
      .populate('uniqueViewers.userId', 'name email')
      .populate('interactionLogs.userId', 'name email');
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for this tile'
      });
    }
    
    res.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('Get tile analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get analytics summary for all tiles (Admin only)
exports.getAllAnalytics = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'viewCount', 
      sortOrder = 'desc' 
    } = req.query;
    
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const analytics = await TileAnalysis.find()
      .populate('tile', 'name category price company tileId')
      .select('-interactionLogs -feedbacks.comment') // Exclude detailed logs for summary
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await TileAnalysis.countDocuments();
    
    // Calculate summary statistics
    const summary = await TileAnalysis.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewCount' },
          totalArViews: { $sum: '$arViewCount' },
          totalArPlacements: { $sum: '$arPlacementCount' },
          totalInteractionTime: { $sum: '$interactionDuration' },
          totalLikes: { $sum: '$totalLikes' },
          averageEngagement: { $avg: '$engagementScore' },
          averageRating: { $avg: '$averageRating' }
        }
      }
    ]);
    
    res.json({
      success: true,
      analytics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      summary: summary[0] || {
        totalViews: 0,
        totalArViews: 0,
        totalArPlacements: 0,
        totalInteractionTime: 0,
        totalLikes: 0,
        averageEngagement: 0,
        averageRating: 0
      }
    });
    
  } catch (error) {
    console.error('Get all analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Get weekly trends for a tile (Admin only)
exports.getWeeklyTrends = async (req, res) => {
  try {
    const { tileId } = req.params;
    const { weeks = 8 } = req.query; // Default to last 8 weeks
    
    const analytics = await TileAnalysis.findOne({ tileId })
      .populate('tile', 'name category');
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for this tile'
      });
    }
    
    // Get recent weekly trends
    const recentTrends = analytics.weeklyTrends
      .sort((a, b) => b.week.localeCompare(a.week))
      .slice(0, parseInt(weeks));
    
    res.json({
      success: true,
      tile: analytics.tile,
      weeklyTrends: recentTrends
    });
    
  } catch (error) {
    console.error('Get weekly trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly trends',
      error: error.message
    });
  }
};

// Get top performing tiles (Admin only)
exports.getTopPerformingTiles = async (req, res) => {
  try {
    const { metric = 'engagementScore', limit = 10 } = req.query;
    
    const validMetrics = [
      'viewCount', 
      'arViewCount', 
      'arPlacementCount', 
      'totalLikes', 
      'engagementScore', 
      'averageRating',
      'conversionRate'
    ];
    
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid metric. Valid options: ' + validMetrics.join(', ')
      });
    }
    
    const topTiles = await TileAnalysis.find()
      .populate('tile', 'name category price company tileId imageUrl')
      .sort({ [metric]: -1 })
      .limit(parseInt(limit))
      .select(`tile tileId ${metric} viewCount arViewCount totalLikes averageRating engagementScore`);
    
    res.json({
      success: true,
      metric,
      topTiles
    });
    
  } catch (error) {
    console.error('Get top performing tiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top performing tiles',
      error: error.message
    });
  }
};

// Get user engagement data for a tile (Admin only)
exports.getUserEngagement = async (req, res) => {
  try {
    const { tileId } = req.params;
    
    const analytics = await TileAnalysis.findOne({ tileId })
      .populate('uniqueViewers.userId', 'name email createdAt')
      .populate('tile', 'name category');
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for this tile'
      });
    }
    
    // Calculate engagement metrics
    const engagementData = {
      tile: analytics.tile,
      totalUniqueViewers: analytics.uniqueViewers.length,
      averageViewsPerUser: analytics.uniqueViewers.length > 0 
        ? analytics.viewCount / analytics.uniqueViewers.length 
        : 0,
      topViewers: analytics.uniqueViewers
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 10),
      viewerRetention: {
        oneTime: analytics.uniqueViewers.filter(v => v.totalViews === 1).length,
        returning: analytics.uniqueViewers.filter(v => v.totalViews > 1).length,
        loyal: analytics.uniqueViewers.filter(v => v.totalViews >= 5).length
      }
    };
    
    res.json({
      success: true,
      engagement: engagementData
    });
    
  } catch (error) {
    console.error('Get user engagement error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user engagement data',
      error: error.message
    });
  }
};

// Delete analytics data for a tile (Admin only)
exports.deleteAnalytics = async (req, res) => {
  try {
    const { tileId } = req.params;
    
    const analytics = await TileAnalysis.findOneAndDelete({ tileId });
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for this tile'
      });
    }
    
    res.json({
      success: true,
      message: 'Analytics deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting analytics',
      error: error.message
    });
  }
};
