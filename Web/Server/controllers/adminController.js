const User = require('../models/User');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { MESSAGES } = require('../config/constants');

// User registration
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: MESSAGES.USER_EXISTS });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, 'user');

  res.status(201).json({ success: true, token });
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
  }
  const token = generateToken(user._id, 'user');
  res.json({ success: true, token });
};

// Admin registration
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const adminExists = await Admin.findOne({ email });
  if (adminExists) return res.status(400).json({ message: MESSAGES.USER_EXISTS });

  const admin = await Admin.create({ name, email, password });
  const token = generateToken(admin._id, 'admin');

  res.status(201).json({ success: true, token });
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });
  }
  const token = generateToken(admin._id, 'admin');
  res.json({ success: true, token });
};
