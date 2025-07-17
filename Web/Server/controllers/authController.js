const Tile = require('../models/Tile');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { MESSAGES } = require('../config/constants');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');

// Admin: create tile
exports.createTile = async (req, res) => {
  const tile = await Tile.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, tile });
};

// Admin: update tile
exports.updateTile = async (req, res) => {
  const tile = await Tile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!tile) return res.status(404).json({ message: MESSAGES.NOT_FOUND });
  res.json({ success: true, tile });
};

// Admin: delete tile
exports.deleteTile = async (req, res) => {
  const tile = await Tile.findByIdAndDelete(req.params.id);
  if (!tile) return res.status(404).json({ message: MESSAGES.NOT_FOUND });
  res.json({ success: true, message: 'Tile deleted' });
};

// Admin: get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
};
// helper to send email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SnapSpace OTP" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

// Step 1: request OTP
exports.requestOtp = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email }); // clear old OTPs
  await Otp.create({
    email,
    otp: otpCode,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
  });

  await sendEmail(email, 'SnapSpace OTP Verification', `Your OTP is: ${otpCode}`);

  res.json({ success: true, message: 'OTP sent to email', tempUser: { name, email, password } });
};

// Step 2: verify OTP and register user
exports.verifyOtpAndRegister = async (req, res) => {
  const { email, otp, name, password } = req.body;

  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteMany({ email });
    return res.status(400).json({ message: 'OTP expired' });
  }

  // Create user after successful OTP verification
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, 'user');

  // Clean up OTP records
  await Otp.deleteMany({ email });

  res.status(201).json({ success: true, token, user: { id: user._id, name, email } });
};