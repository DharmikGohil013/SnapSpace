const Tile = require('../models/Tile');
const { MESSAGES } = require('../config/constants');

// Get all tiles
exports.getAllTiles = async (req, res) => {
  const tiles = await Tile.find();
  res.json({ success: true, tiles });
};

// Get tile by ID
exports.getTileById = async (req, res) => {
  const tile = await Tile.findById(req.params.id);
  if (!tile) return res.status(404).json({ message: MESSAGES.NOT_FOUND });
  res.json({ success: true, tile });
};

// Search tiles by keyword or category
exports.searchTiles = async (req, res) => {
  const { q } = req.query;
  const tiles = await Tile.find({
    $or: [
      { name: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') },
      { usage: { $in: [q.toLowerCase()] } },
    ],
  });
  res.json({ success: true, tiles });
};
