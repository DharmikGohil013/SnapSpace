# SnapSpace Server

A Node.js backend server for SnapSpace - a tile marketplace application.

## Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password encryption with bcrypt

- **Tile Management**
  - CRUD operations for tiles
  - Advanced filtering and search
  - Category-based organization
  - Featured tiles system
  - Image upload support

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Persistent cart storage
  - Stock validation

- **Admin Dashboard**
  - User management
  - Tile management
  - Dashboard statistics
  - Role assignment

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **File Upload**: Multer
- **CORS**: Cross-origin resource sharing
- **Logging**: Morgan

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env`

4. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in `.env`

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/snapspace
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Tiles
- `GET /api/tiles` - Get all tiles (with filtering)
- `GET /api/tiles/:id` - Get single tile
- `GET /api/tiles/featured` - Get featured tiles
- `GET /api/tiles/category/:category` - Get tiles by category
- `GET /api/tiles/search` - Search tiles

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/tiles` - Get all tiles (admin view)
- `POST /api/admin/tiles` - Create new tile
- `PUT /api/admin/tiles/:id` - Update tile
- `DELETE /api/admin/tiles/:id` - Delete tile
- `PATCH /api/admin/tiles/:id/featured` - Toggle featured status
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/role` - Update user role

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Project Structure

```
Server/
├── config/
│   ├── db.js               # Database connection
│   └── constants.js        # Application constants
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── tileController.js   # Tile operations
│   ├── cartController.js   # Cart operations
│   └── adminController.js  # Admin operations
├── middlewares/
│   ├── auth.js             # Authentication middleware
│   ├── role.js             # Role-based access
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User schema
│   ├── Tile.js             # Tile schema
│   └── Cart.js             # Cart schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── tileRoutes.js       # Tile routes
│   ├── cartRoutes.js       # Cart routes
│   └── adminRoutes.js      # Admin routes
├── utils/
│   ├── generateToken.js    # JWT utilities
│   └── fileUpload.js       # File upload config
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js               # Main application file
```

## License

This project is licensed under the MIT License.
