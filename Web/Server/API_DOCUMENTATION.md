# 🚀 SnapSpace API Documentation for Postman Testing

## Base URL: `http://localhost:5000`

---

## 🔐 AUTHENTICATION ENDPOINTS (`/api/auth`)

### 1. Register User
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "123456",
  "phone": "9876543210"
}
```

### 2. Login User
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response:** Returns JWT token

### 3. Get User Profile
**GET** `/api/auth/me`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Update User Profile
**PUT** `/api/auth/profile`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai", 
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

### 5. Change Password
**PUT** `/api/auth/change-password`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

---

## 🏪 TILE ENDPOINTS (`/api/tiles`)

### 6. Get All Tiles
**GET** `/api/tiles`
**Query Parameters (optional):**
```
?page=1&limit=12&category=ceramic&minPrice=100&maxPrice=1000&search=floor&featured=true&sortBy=price&sortOrder=asc
```

### 7. Get Single Tile
**GET** `/api/tiles/:id`
**Example:** `/api/tiles/507f1f77bcf86cd799439011`

### 8. Get Featured Tiles
**GET** `/api/tiles/featured`
**Query Parameters:**
```
?limit=8
```

### 9. Get Tiles by Category
**GET** `/api/tiles/category/:category`
**Example:** `/api/tiles/category/ceramic`
**Query Parameters:**
```
?page=1&limit=12
```

### 10. Search Tiles
**GET** `/api/tiles/search`
**Query Parameters:**
```
?q=bathroom&page=1&limit=12
```

---

## 🛒 CART ENDPOINTS (`/api/cart`)

### 11. Get User Cart
**GET** `/api/cart`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 12. Add Item to Cart
**POST** `/api/cart/add`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "tileId": "507f1f77bcf86cd799439011",
  "quantity": 5
}
```

### 13. Update Cart Item
**PUT** `/api/cart/update/:itemId`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "quantity": 10
}
```

### 14. Remove Item from Cart
**DELETE** `/api/cart/remove/:itemId`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 15. Clear Cart
**DELETE** `/api/cart/clear`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👑 ADMIN ENDPOINTS (`/api/admin`)

### 16. Get Dashboard Stats
**GET** `/api/admin/stats`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 17. Get All Tiles (Admin)
**GET** `/api/admin/tiles`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```
**Query Parameters:**
```
?page=1&limit=20&category=ceramic&isActive=true&search=floor
```

### 18. Create New Tile
**POST** `/api/admin/tiles`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Premium Ceramic Floor Tile",
  "description": "High-quality ceramic tile perfect for living rooms and bedrooms",
  "category": "ceramic",
  "price": 850,
  "discountPrice": 750,
  "images": [
    {
      "url": "https://example.com/tile1.jpg",
      "altText": "Tile front view"
    }
  ],
  "specifications": {
    "size": {
      "length": 600,
      "width": 600,
      "thickness": 10,
      "unit": "mm"
    },
    "material": "Ceramic",
    "finish": "Glossy",
    "color": "White",
    "pattern": "Plain",
    "usage": ["floor", "wall"]
  },
  "inventory": {
    "stock": 500,
    "unit": "pieces",
    "lowStockAlert": 50
  },
  "tags": ["premium", "ceramic", "floor", "glossy"],
  "isFeatured": true,
  "isActive": true
}
```

### 19. Update Tile
**PUT** `/api/admin/tiles/:id`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```
**Body:** (Same structure as create, with fields to update)

### 20. Delete Tile (Soft Delete)
**DELETE** `/api/admin/tiles/:id`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 21. Toggle Featured Status
**PATCH** `/api/admin/tiles/:id/featured`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 22. Get All Users
**GET** `/api/admin/users`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 23. Update User Role
**PATCH** `/api/admin/users/:id/role`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "role": "admin"
}
```

---

## 🏥 HEALTH CHECK

### 24. Server Health Check
**GET** `/health`
No authentication required.

---

## 📋 TESTING WORKFLOW

### Step 1: Create Admin User
1. **Register:** Use endpoint #1 to create a user
2. **Login:** Use endpoint #2 to get JWT token
3. **Manually promote to admin:** Update user role in database

### Step 2: Test User Features
1. **Register:** Create regular user (endpoint #1)
2. **Login:** Get JWT token (endpoint #2)
3. **Get Profile:** Test endpoint #3
4. **Browse Tiles:** Test endpoints #6-10

### Step 3: Test Cart Features
1. **Get Cart:** Test endpoint #11
2. **Add Items:** Test endpoint #12
3. **Update Items:** Test endpoint #13

### Step 4: Test Admin Features
1. **Create Tiles:** Test endpoint #18
2. **Manage Users:** Test endpoints #22-23
3. **View Stats:** Test endpoint #16

---

## 🔧 IMPORTANT NOTES

1. **JWT Token:** Save token from login response and use in Authorization header
2. **Admin Role:** First user needs manual promotion to admin in database
3. **Object IDs:** Use valid MongoDB ObjectIds (24 hex characters)
4. **CORS:** Frontend should run on http://localhost:3000
5. **File Uploads:** Currently configured but needs implementation

---

## 🐛 COMMON ISSUES

1. **"Route not found":** Check endpoint spelling and method
2. **"Unauthorized":** Include Bearer token in Authorization header
3. **"Forbidden":** User lacks required role permissions
4. **"Validation Error":** Check required fields in request body
