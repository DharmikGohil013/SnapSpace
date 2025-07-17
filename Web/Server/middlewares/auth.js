// middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { MESSAGES } = require('../config/constants');

// Protect route middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      req.userRole = decoded.role;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: MESSAGES.TOKEN_INVALID });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: MESSAGES.UNAUTHORIZED });
  }
};

// Admin role middleware
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: MESSAGES.FORBIDDEN });
  }
  next();
};

module.exports = { protect, isAdmin };
