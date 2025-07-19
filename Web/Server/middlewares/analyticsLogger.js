// middlewares/analyticsLogger.js

const TileAnalysis = require('../models/TileAnalysis');
const Tile = require('../models/Tile');

// Middleware to automatically log tile interactions
const logTileInteraction = (interactionType) => {
  return async (req, res, next) => {
    // Store original res.json to intercept successful responses
    const originalJson = res.json.bind(res);
    
    res.json = async function(data) {
      // Only log if response is successful and contains tile data
      if (res.statusCode >= 200 && res.statusCode < 300 && data.success) {
        try {
          let tileId = null;
          let tileObjectId = null;
          
          // Extract tileId from different response structures
          if (data.tile && data.tile.tileId) {
            tileId = data.tile.tileId;
            tileObjectId = data.tile._id;
          } else if (data.tiles && data.tiles.length > 0) {
            // For multiple tiles, log view for each
            for (const tile of data.tiles) {
              if (tile.tileId && req.user) {
                await logSingleInteraction(tile.tileId, tile._id, req.user._id, interactionType, req);
              }
            }
            return originalJson(data);
          } else if (req.params.tileId) {
            tileId = req.params.tileId;
            // Find tile ObjectId
            const tile = await Tile.findOne({ tileId });
            if (tile) {
              tileObjectId = tile._id;
            }
          }
          
          // Log interaction if we have the necessary data
          if (tileId && tileObjectId && req.user) {
            await logSingleInteraction(tileId, tileObjectId, req.user._id, interactionType, req);
          }
        } catch (error) {
          console.error('Analytics logging error:', error);
          // Don't fail the request if analytics logging fails
        }
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

// Helper function to log a single interaction
const logSingleInteraction = async (tileId, tileObjectId, userId, interactionType, req) => {
  try {
    // Get or create analytics for this tile
    const analytics = await TileAnalysis.getOrCreateAnalytics(tileId, tileObjectId);
    
    // Extract device info from request headers
    const deviceInfo = {
      platform: req.headers['x-platform'] || 'unknown',
      device: req.headers['x-device'] || 'unknown',
      browser: req.headers['user-agent'] ? req.headers['user-agent'].split(' ')[0] : 'unknown'
    };
    
    // Get session ID from headers or generate one
    const sessionId = req.headers['x-session-id'] || req.sessionID || '';
    
    // Log the interaction
    await analytics.logInteraction({
      userId,
      interactionType,
      duration: 0, // Will be updated by client-side duration tracking
      sessionId,
      deviceInfo
    });
    
    // Update weekly trends
    await analytics.updateWeeklyTrends();
    
  } catch (error) {
    console.error('Single interaction logging error:', error);
  }
};

// Middleware to log tile views
const logTileView = logTileInteraction('view');

// Middleware to log AR views
const logArView = logTileInteraction('ar_view');

// Middleware to log AR placements
const logArPlacement = logTileInteraction('ar_placement');

// Manual interaction logger for custom events
const logCustomInteraction = async (req, res, next) => {
  req.logAnalytics = async (tileId, interactionType, duration = 0) => {
    try {
      if (!req.user) return;
      
      const tile = await Tile.findOne({ tileId });
      if (!tile) return;
      
      await logSingleInteraction(tileId, tile._id, req.user._id, interactionType, req);
    } catch (error) {
      console.error('Custom analytics logging error:', error);
    }
  };
  
  next();
};

module.exports = {
  logTileView,
  logArView,
  logArPlacement,
  logCustomInteraction,
  logTileInteraction
};
