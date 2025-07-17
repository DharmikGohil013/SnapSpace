const User = require('../models/User');
const { MESSAGES } = require('../config/constants');

// Get user profile
exports.getUserProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      cart: req.user.cart,
    },
  });
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

  user.name = req.body.name || user.name;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({ success: true, user: updatedUser });
};
