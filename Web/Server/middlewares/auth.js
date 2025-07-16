const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MESSAGES } = require('../config/constants');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: error.message === 'jwt expired' ? MESSAGES.TOKEN_EXPIRED : MESSAGES.TOKEN_INVALID
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED
    });
  }
};

// Optional auth - doesn't require token but sets user if provided
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Continue without user if token is invalid
      req.user = null;
    }
  }
  
  next();
};

module.exports = {
  protect,
  optionalAuth
};
