# Tile Analytics API Documentation

## Overview
Complete backend system for tracking tile interactions, user engagement, and AR usage analytics in the SnapSpace AR Visual App.

## Base URL
`https://snapspace-ry3k.onrender.com/api/analytics`

---

## User APIs (Authenticated Users)

### 1. Log User Interaction
**POST** `/api/analytics/interactions`

Track user interactions with tiles (views, AR usage, likes, etc.)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer USER_TOKEN
```

**Request Body:**
```json
{
  "tileId": "A3X9K",
  "interactionType": "ar_view",
  "duration": 45,
  "sessionId": "session_12345",
  "deviceInfo": {
    "platform": "iOS",
    "device": "iPhone 14",
    "browser": "Safari"
  }
}
```

**Interaction Types:**
- `view` - Regular tile view
- `ar_view` - AR view of tile
- `ar_placement` - Tile placed in AR
- `like` - User liked the tile
- `unlike` - User unliked the tile

**Response:**
```json
{
  "success": true,
  "message": "Interaction logged successfully",
  "analytics": {
    "viewCount": 127,
    "arViewCount": 45,
    "arPlacementCount": 23,
    "totalLikes": 89,
    "engagementScore": 78
  }
}
```

### 2. Add Feedback
**POST** `/api/analytics/feedback`

Add user rating and comment for a tile.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer USER_TOKEN
```

**Request Body:**
```json
{
  "tileId": "A3X9K",
  "rating": 4,
  "comment": "Great tile for modern bathrooms. Love the finish!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback added successfully",
  "averageRating": 4.2,
  "totalFeedbacks": 23
}
```

---

## Admin APIs (Admin Only)

### 3. Get All Tiles Analytics
**GET** `/api/analytics/tiles`

Get analytics summary for all tiles with pagination and sorting.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (default: viewCount)
- `sortOrder` - asc/desc (default: desc)

**Example:** `/api/analytics/tiles?page=1&limit=5&sortBy=engagementScore&sortOrder=desc`

**Response:**
```json
{
  "success": true,
  "analytics": [
    {
      "_id": "64f8b2c4e1234567890abcde",
      "tileId": "A3X9K",
      "tile": {
        "name": "Premium Ceramic Tile",
        "category": "ceramic",
        "price": 29.99,
        "company": "SnapSpace Ceramics"
      },
      "viewCount": 547,
      "arViewCount": 123,
      "arPlacementCount": 67,
      "totalLikes": 89,
      "averageRating": 4.2,
      "engagementScore": 85,
      "conversionRate": 54.5,
      "interactionDuration": 45678,
      "createdAt": "2024-07-19T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "pages": 5
  },
  "summary": {
    "totalViews": 12547,
    "totalArViews": 3421,
    "totalArPlacements": 1876,
    "totalInteractionTime": 876543,
    "totalLikes": 2341,
    "averageEngagement": 72.4,
    "averageRating": 4.1
  }
}
```

### 4. Get Specific Tile Analytics
**GET** `/api/analytics/tiles/:tileId`

Get detailed analytics for a specific tile.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Example:** `/api/analytics/tiles/A3X9K`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "_id": "64f8b2c4e1234567890abcde",
    "tileId": "A3X9K",
    "tile": {
      "name": "Premium Ceramic Tile",
      "category": "ceramic",
      "price": 29.99,
      "company": "SnapSpace Ceramics"
    },
    "viewCount": 547,
    "arViewCount": 123,
    "arPlacementCount": 67,
    "interactionDuration": 45678,
    "totalLikes": 89,
    "uniqueViewers": [
      {
        "userId": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "firstViewedAt": "2024-07-15T10:30:00.000Z",
        "lastViewedAt": "2024-07-19T14:20:00.000Z",
        "totalViews": 5
      }
    ],
    "feedbacks": [
      {
        "userId": {
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "rating": 5,
        "comment": "Excellent quality tile!",
        "createdAt": "2024-07-18T12:00:00.000Z"
      }
    ],
    "averageRating": 4.2,
    "conversionRate": 54.5,
    "engagementScore": 85,
    "weeklyTrends": [
      {
        "week": "2024-W29",
        "totalViews": 127,
        "totalArViews": 34,
        "totalArPlacements": 18,
        "totalInteractionTime": 5432,
        "uniqueUsers": 23,
        "averageRating": 4.2
      }
    ]
  }
}
```

### 5. Get Weekly Trends
**GET** `/api/analytics/tiles/:tileId/trends`

Get weekly trend data for a specific tile.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `weeks` - Number of weeks to retrieve (default: 8)

**Example:** `/api/analytics/tiles/A3X9K/trends?weeks=12`

**Response:**
```json
{
  "success": true,
  "tile": {
    "name": "Premium Ceramic Tile",
    "category": "ceramic"
  },
  "weeklyTrends": [
    {
      "week": "2024-W29",
      "totalViews": 127,
      "totalArViews": 34,
      "totalArPlacements": 18,
      "totalInteractionTime": 5432,
      "uniqueUsers": 23,
      "averageRating": 4.2
    },
    {
      "week": "2024-W28",
      "totalViews": 98,
      "totalArViews": 28,
      "totalArPlacements": 12,
      "totalInteractionTime": 4321,
      "uniqueUsers": 19,
      "averageRating": 4.0
    }
  ]
}
```

### 6. Get Top Performing Tiles
**GET** `/api/analytics/top-performing`

Get top performing tiles based on different metrics.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Query Parameters:**
- `metric` - Metric to sort by (default: engagementScore)
  - `viewCount`
  - `arViewCount` 
  - `arPlacementCount`
  - `totalLikes`
  - `engagementScore`
  - `averageRating`
  - `conversionRate`
- `limit` - Number of results (default: 10)

**Example:** `/api/analytics/top-performing?metric=arViewCount&limit=5`

**Response:**
```json
{
  "success": true,
  "metric": "arViewCount",
  "topTiles": [
    {
      "_id": "64f8b2c4e1234567890abcde",
      "tileId": "A3X9K",
      "tile": {
        "name": "Premium Ceramic Tile",
        "category": "ceramic",
        "price": 29.99,
        "company": "SnapSpace Ceramics",
        "imageUrl": "https://example.com/tile1.jpg"
      },
      "arViewCount": 234,
      "viewCount": 567,
      "totalLikes": 89,
      "averageRating": 4.2,
      "engagementScore": 85
    }
  ]
}
```

### 7. Get User Engagement Data
**GET** `/api/analytics/tiles/:tileId/engagement`

Get detailed user engagement metrics for a tile.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Example:** `/api/analytics/tiles/A3X9K/engagement`

**Response:**
```json
{
  "success": true,
  "engagement": {
    "tile": {
      "name": "Premium Ceramic Tile",
      "category": "ceramic"
    },
    "totalUniqueViewers": 145,
    "averageViewsPerUser": 3.8,
    "topViewers": [
      {
        "userId": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalViews": 15,
        "firstViewedAt": "2024-07-10T10:30:00.000Z",
        "lastViewedAt": "2024-07-19T14:20:00.000Z"
      }
    ],
    "viewerRetention": {
      "oneTime": 89,
      "returning": 56,
      "loyal": 12
    }
  }
}
```

### 8. Delete Analytics Data
**DELETE** `/api/analytics/tiles/:tileId`

Delete all analytics data for a specific tile.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer ADMIN_TOKEN
```

**Example:** `/api/analytics/tiles/A3X9K`

**Response:**
```json
{
  "success": true,
  "message": "Analytics deleted successfully"
}
```

---

## Automatic Analytics Logging

The system automatically logs interactions when:

1. **Tile Views** - When users request tile details via `/api/tiles/:id`
2. **Search Results** - When users search for tiles
3. **List Views** - When users browse tile listings

### Custom Headers for Enhanced Analytics

Include these headers in requests for better analytics:

```
X-Platform: iOS | Android | Web
X-Device: iPhone 14 | Samsung Galaxy S23 | Desktop
X-Session-ID: unique_session_identifier
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "tileId and interactionType are required"
}
```

**401 Unauthorized:**
```json
{
  "message": "Not authorized, token failed"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied, admin only"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Analytics not found for this tile"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Error logging interaction",
  "error": "Error details"
}
```

---

## Analytics Features

✅ **Real-time Interaction Logging**
✅ **AR Usage Tracking** 
✅ **User Engagement Metrics**
✅ **Weekly Trend Analysis**
✅ **Feedback & Rating System**
✅ **Performance Scoring**
✅ **Conversion Rate Tracking**
✅ **Device & Platform Analytics**
✅ **Session-based Tracking**
✅ **Admin Dashboard Data**
✅ **Automatic View Logging**
✅ **User Retention Analysis**

The system provides comprehensive analytics for understanding tile performance, user behavior, and AR engagement patterns!
