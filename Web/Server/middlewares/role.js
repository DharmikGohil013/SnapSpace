const { USER_ROLES, MESSAGES } = require('../config/constants');

// Check if user has admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === USER_ROLES.ADMIN) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: MESSAGES.FORBIDDEN
    });
  }
};

// Check if user has user role or higher
const userOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === USER_ROLES.USER || req.user.role === USER_ROLES.ADMIN)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: MESSAGES.FORBIDDEN
    });
  }
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === USER_ROLES.ADMIN || req.user._id.toString() === req.params.userId)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: MESSAGES.FORBIDDEN
    });
  }
};

module.exports = {
  adminOnly,
  userOrAdmin,
  ownerOrAdmin
};
