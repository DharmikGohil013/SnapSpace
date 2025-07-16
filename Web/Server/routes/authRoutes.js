const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // Apply to all routes below

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Temporary route to make user admin (remove after first admin is created)
router.patch('/make-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'User role updated to admin',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update role',
      error: error.message
    });
  }
});

module.exports = router;
