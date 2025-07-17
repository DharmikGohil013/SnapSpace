// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require('../controllers/adminController');
const { requestOtp, verifyOtpAndRegister } = require('../controllers/authController');


// User auth
router.post('/user/register', registerUser); // <--- line 13 of authRoutes.js
router.post('/user/request-otp', requestOtp);
router.post('/user/verify-otp', verifyOtpAndRegister);
router.post('/user/login', loginUser);

// Admin auth
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;
