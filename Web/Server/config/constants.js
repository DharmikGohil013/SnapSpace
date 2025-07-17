// config/constants.js

// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Tile categories
const TILE_CATEGORIES = {
  CERAMIC: 'ceramic',
  PORCELAIN: 'porcelain',
  STONE: 'stone',
  GLASS: 'glass',
  MOSAIC: 'mosaic',
};

// Order status (for future use)
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Response messages
const MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_EXISTS: 'User already exists',
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
};

module.exports = {
  USER_ROLES,
  TILE_CATEGORIES,
  ORDER_STATUS,
  MESSAGES,
};
