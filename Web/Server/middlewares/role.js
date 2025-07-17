// middlewares/role.js

const { USER_ROLES, MESSAGES } = require('../config/constants');

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ success: false, message: MESSAGES.FORBIDDEN });
    }
  };
};

module.exports = { requireRole };
