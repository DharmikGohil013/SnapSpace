// models/TileAnalysis.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: '',
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const interactionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'ar_view', 'ar_placement', 'like', 'unlike'],
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  sessionId: {
    type: String,
    default: ''
  },
  deviceInfo: {
    platform: String, // iOS, Android, Web
    device: String,   // iPhone 14, Samsung Galaxy, etc.
    browser: String   // Safari, Chrome, etc.
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const weeklyTrendSchema = new mongoose.Schema({
  week: {
    type: String, // Format: "2024-W29" (Year-Week)
    required: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalArViews: {
    type: Number,
    default: 0
  },
  totalArPlacements: {
    type: Number,
    default: 0
  },
  totalInteractionTime: {
    type: Number,
    default: 0
  },
  uniqueUsers: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
});

const tileAnalysisSchema = new mongoose.Schema({
  tileId: {
    type: String,
    required: true,
    unique: true,
    ref: 'Tile'
  },
  tile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tile',
    required: true
  },
  
  // Core Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  arViewCount: {
    type: Number,
    default: 0
  },
  arPlacementCount: {
    type: Number,
    default: 0
  },
  interactionDuration: {
    type: Number, // total seconds
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  
  // User Engagement
  uniqueViewers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    firstViewedAt: {
      type: Date,
      default: Date.now
    },
    lastViewedAt: {
      type: Date,
      default: Date.now
    },
    totalViews: {
      type: Number,
      default: 1
    }
  }],
  
  // Feedback System
  feedbacks: [feedbackSchema],
  
  // Average Ratings
  averageRating: {
    type: Number,
    default: 0
  },
  
  // Interaction Logs
  interactionLogs: [interactionLogSchema],
  
  // Weekly Trends
  weeklyTrends: [weeklyTrendSchema],
  
  // Performance Metrics
  conversionRate: {
    type: Number, // AR placements / AR views
    default: 0
  },
  engagementScore: {
    type: Number, // Custom calculated score
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update analytics calculations
tileAnalysisSchema.pre('save', function(next) {
  // Update timestamps
  this.updatedAt = new Date();
  
  // Calculate average rating
  if (this.feedbacks && this.feedbacks.length > 0) {
    const totalRating = this.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    this.averageRating = Math.round((totalRating / this.feedbacks.length) * 10) / 10;
  }
  
  // Calculate conversion rate
  if (this.arViewCount > 0) {
    this.conversionRate = Math.round((this.arPlacementCount / this.arViewCount) * 100 * 10) / 10;
  }
  
  // Calculate engagement score (custom formula)
  const normalizedViews = Math.min(this.viewCount / 100, 1); // Max score at 100 views
  const normalizedDuration = Math.min(this.interactionDuration / 3600, 1); // Max score at 1 hour
  const normalizedRating = this.averageRating / 5;
  const normalizedConversion = this.conversionRate / 100;
  
  this.engagementScore = Math.round(
    (normalizedViews * 0.3 + 
     normalizedDuration * 0.2 + 
     normalizedRating * 0.3 + 
     normalizedConversion * 0.2) * 100
  );
  
  next();
});

// Static method to get or create analytics for a tile
tileAnalysisSchema.statics.getOrCreateAnalytics = async function(tileId, tileObjectId) {
  let analytics = await this.findOne({ tileId });
  
  if (!analytics) {
    analytics = await this.create({
      tileId,
      tile: tileObjectId
    });
  }
  
  return analytics;
};

// Method to log interaction
tileAnalysisSchema.methods.logInteraction = async function(interactionData) {
  const { userId, interactionType, duration = 0, sessionId = '', deviceInfo = {} } = interactionData;
  
  // Add to interaction logs
  this.interactionLogs.push({
    userId,
    interactionType,
    duration,
    sessionId,
    deviceInfo
  });
  
  // Update counters
  switch (interactionType) {
    case 'view':
      this.viewCount += 1;
      break;
    case 'ar_view':
      this.arViewCount += 1;
      break;
    case 'ar_placement':
      this.arPlacementCount += 1;
      break;
    case 'like':
      this.totalLikes += 1;
      break;
    case 'unlike':
      this.totalLikes = Math.max(0, this.totalLikes - 1);
      break;
  }
  
  // Update interaction duration
  this.interactionDuration += duration;
  
  // Update unique viewers
  const existingViewer = this.uniqueViewers.find(v => v.userId.toString() === userId.toString());
  if (existingViewer) {
    existingViewer.lastViewedAt = new Date();
    existingViewer.totalViews += 1;
  } else if (['view', 'ar_view'].includes(interactionType)) {
    this.uniqueViewers.push({
      userId,
      firstViewedAt: new Date(),
      lastViewedAt: new Date(),
      totalViews: 1
    });
  }
  
  await this.save();
  return this;
};

// Method to add feedback
tileAnalysisSchema.methods.addFeedback = async function(feedbackData) {
  const { userId, rating, comment = '' } = feedbackData;
  
  // Check if user already gave feedback
  const existingFeedbackIndex = this.feedbacks.findIndex(
    f => f.userId.toString() === userId.toString()
  );
  
  if (existingFeedbackIndex !== -1) {
    // Update existing feedback
    this.feedbacks[existingFeedbackIndex].rating = rating;
    this.feedbacks[existingFeedbackIndex].comment = comment;
    this.feedbacks[existingFeedbackIndex].createdAt = new Date();
  } else {
    // Add new feedback
    this.feedbacks.push({
      userId,
      rating,
      comment
    });
  }
  
  await this.save();
  return this;
};

// Method to get weekly trend data
tileAnalysisSchema.methods.getWeeklyTrend = function(weekString) {
  return this.weeklyTrends.find(trend => trend.week === weekString);
};

// Method to update weekly trends
tileAnalysisSchema.methods.updateWeeklyTrends = async function() {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(((now - new Date(year, 0, 1)) / 86400000 + 1) / 7);
  const weekString = `${year}-W${week.toString().padStart(2, '0')}`;
  
  let weeklyTrend = this.weeklyTrends.find(trend => trend.week === weekString);
  
  if (!weeklyTrend) {
    weeklyTrend = {
      week: weekString,
      totalViews: 0,
      totalArViews: 0,
      totalArPlacements: 0,
      totalInteractionTime: 0,
      uniqueUsers: 0,
      averageRating: 0
    };
    this.weeklyTrends.push(weeklyTrend);
  }
  
  // Calculate this week's data from interaction logs
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const thisWeekLogs = this.interactionLogs.filter(log => log.timestamp >= weekStart);
  
  weeklyTrend.totalViews = thisWeekLogs.filter(log => log.interactionType === 'view').length;
  weeklyTrend.totalArViews = thisWeekLogs.filter(log => log.interactionType === 'ar_view').length;
  weeklyTrend.totalArPlacements = thisWeekLogs.filter(log => log.interactionType === 'ar_placement').length;
  weeklyTrend.totalInteractionTime = thisWeekLogs.reduce((sum, log) => sum + log.duration, 0);
  weeklyTrend.uniqueUsers = new Set(thisWeekLogs.map(log => log.userId.toString())).size;
  weeklyTrend.averageRating = this.averageRating;
  
  await this.save();
  return weeklyTrend;
};

module.exports = mongoose.model('TileAnalysis', tileAnalysisSchema);
