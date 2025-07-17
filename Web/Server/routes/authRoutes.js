// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require('../controllers/adminController');


// User auth
router.post('/user/register', registerUser); // <--- line 13 of authRoutes.js

router.post('/user/login', loginUser);

// Admin auth
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;
