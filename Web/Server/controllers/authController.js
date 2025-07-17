const Tile = require('../models/Tile');
const User = require('../models/User');
const { MESSAGES } = require('../config/constants');

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
