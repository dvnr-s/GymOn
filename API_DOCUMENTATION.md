# GymOn API Documentation

Complete REST API documentation for the GymOn backend.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.vercel.app/api`

## Authentication

All protected endpoints require a valid JWT token. Include the token in requests using one of these methods:

### Authorization Header (Recommended)

```
Authorization: Bearer <your-jwt-token>
```

### HTTP-Only Cookie

The token is automatically set as an HTTP-only cookie after login/register.

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

In development mode, additional details may be included:

```json
{
  "error": "Error message description",
  "details": "Detailed error information"
}
```

## Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### Register User

Create a new user account.

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user",
  "profile": {
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username (3-30 chars) |
| email | string | Yes | Valid email address |
| password | string | Yes | Min 6 characters |
| role | string | No | "user" or "instructor" (default: "user") |
| profile | object | No | Profile information |

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "profile": {
      "name": "John Doe",
      "phone": "+1234567890"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login

Authenticate user and get JWT token.

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "profile": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout

Clear authentication token.

**POST** `/api/auth/logout`

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User

Get authenticated user's information.

**GET** `/api/auth/me`

🔒 **Requires Authentication**

**Response (200 OK):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "profile": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## User Endpoints

### Get User Profile

**GET** `/api/users/:id`

**Response (200 OK):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "profile": {
      "name": "John Doe",
      "phone": "+1234567890",
      "bio": "Fitness enthusiast"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update User Profile

**PUT** `/api/users/:id`

🔒 **Requires Authentication** (Users can only update their own profile)

**Request Body:**

```json
{
  "username": "johndoe_updated",
  "profile": {
    "name": "John Doe",
    "bio": "Updated bio",
    "location": "New York"
  }
}
```

---

### Delete User

**DELETE** `/api/users/:id`

🔒 **Requires Authentication** (Users can only delete their own account)

---

## Health Data Endpoints

### Add Health Data

**POST** `/api/health-data`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "weight": 75.5,
  "height": 175,
  "bodyFat": 18.5,
  "muscleMass": 35.2,
  "dailyCalories": {
    "consumed": 2000,
    "target": 2200
  },
  "dailyMacros": {
    "protein": 120,
    "carbs": 200,
    "fat": 70
  },
  "date": "2024-01-15T00:00:00.000Z",
  "notes": "Feeling good today"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| weight | number | Yes | Weight in kg |
| height | number | Yes | Height in cm |
| bodyFat | number | No | Body fat percentage |
| muscleMass | number | No | Muscle mass in kg |
| dailyCalories | object | No | Calorie tracking |
| dailyMacros | object | No | Macro tracking |
| date | string | No | Date of entry (default: now) |
| notes | string | No | Additional notes |

**Response (201 Created):**

```json
{
  "message": "Health data added successfully",
  "healthData": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "weight": 75.5,
    "height": 175,
    "bmi": 24.7,
    "bodyFat": 18.5,
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get Health Data

**GET** `/api/health-data`

🔒 **Requires Authentication**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 30) |
| startDate | string | Filter from date (ISO format) |
| endDate | string | Filter to date (ISO format) |

**Response (200 OK):**

```json
{
  "healthData": [...],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "totalPages": 4
  }
}
```

---

### Get User Health History

**GET** `/api/health-data/:userId`

🔒 **Requires Authentication**

---

### Get Latest Health Data

**GET** `/api/health-data/:userId/latest`

🔒 **Requires Authentication**

---

### Update Health Entry

**PUT** `/api/health-data/entry/:id`

🔒 **Requires Authentication**

---

### Delete Health Entry

**DELETE** `/api/health-data/entry/:id`

🔒 **Requires Authentication**

---

## Diet Plan Endpoints

### Create Diet Plan

**POST** `/api/diet-plans`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "planType": "mediterranean",
  "name": "My Mediterranean Plan",
  "description": "A heart-healthy diet plan",
  "dailyCalories": 2000,
  "macroRatio": {
    "protein": 25,
    "carbs": 45,
    "fat": 30
  },
  "meals": [
    {
      "name": "Breakfast",
      "time": "8:00 AM",
      "calories": 400,
      "items": ["Greek yogurt", "Fresh berries", "Whole grain toast"]
    }
  ],
  "tags": ["heart-healthy", "balanced"],
  "tips": ["Use olive oil", "Eat fish twice a week"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| planType | string | Yes | mediterranean, keto, plant-based, intermittent-fasting, paleo, dash, custom |
| name | string | Yes | Plan name |
| dailyCalories | number | Yes | Daily calorie target (500-10000) |
| macroRatio | object | Yes | Must total 100% |
| meals | array | No | Array of meal objects |

---

### Get Diet Plans

**GET** `/api/diet-plans`

🔒 **Requires Authentication**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| isActive | boolean | Filter by active status |
| planType | string | Filter by plan type |

---

### Get Diet Plan by ID

**GET** `/api/diet-plans/:id`

🔒 **Requires Authentication**

---

### Update Diet Plan

**PUT** `/api/diet-plans/:id`

🔒 **Requires Authentication**

---

### Delete Diet Plan

**DELETE** `/api/diet-plans/:id`

🔒 **Requires Authentication**

---

### Track Meal Completion

**PATCH** `/api/diet-plans/:id/track-meal`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "mealIndex": 0,
  "completed": true
}
```

**Response (200 OK):**

```json
{
  "message": "Meal tracking updated successfully",
  "meal": {
    "name": "Breakfast",
    "completed": true
  },
  "completedMeals": 1,
  "totalMeals": 4
}
```

---

### Get User Diet Plans

**GET** `/api/diet-plans/user/:userId`

🔒 **Requires Authentication**

---

## Workout Plan Endpoints

### Create Workout Plan

**POST** `/api/workouts`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "planName": "Upper Body Strength",
  "description": "Focus on chest, back, and arms",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 4,
      "reps": 10,
      "weight": 60
    },
    {
      "name": "Pull-ups",
      "sets": 3,
      "reps": 8
    }
  ],
  "targetMuscleGroups": ["chest", "back", "arms"],
  "difficulty": "intermediate",
  "estimatedDuration": 45,
  "scheduledDays": ["Monday", "Thursday"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| planName | string | Yes | Workout name |
| exercises | array | Yes | At least one exercise required |
| exercises[].name | string | Yes | Exercise name |
| exercises[].sets | number | Yes | Number of sets |
| exercises[].reps | number | Yes | Reps per set |
| exercises[].weight | number | No | Weight in kg |
| difficulty | string | No | beginner, intermediate, advanced |

---

### Get Workout Plans

**GET** `/api/workouts`

🔒 **Requires Authentication**

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| isActive | boolean | Filter by active status |
| difficulty | string | Filter by difficulty |

---

### Get Workout by ID

**GET** `/api/workouts/:id`

🔒 **Requires Authentication**

---

### Update Workout Plan

**PUT** `/api/workouts/:id`

🔒 **Requires Authentication**

---

### Delete Workout Plan

**DELETE** `/api/workouts/:id`

🔒 **Requires Authentication**

---

### Complete Workout

**PATCH** `/api/workouts/:id/complete`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "duration": 45,
  "notes": "Great workout, increased weight on bench press"
}
```

**Response (200 OK):**

```json
{
  "message": "Workout marked as completed",
  "completedSessions": 5,
  "latestSession": {
    "date": "2024-01-15T10:30:00.000Z",
    "completed": true,
    "duration": 45,
    "notes": "Great workout, increased weight on bench press"
  }
}
```

---

### Get User Workouts

**GET** `/api/workouts/user/:userId`

🔒 **Requires Authentication**

---

## Chat Endpoints

### Send Message

**POST** `/api/chat/messages`

🔒 **Requires Authentication**

**Request Body:**

```json
{
  "receiverId": "507f1f77bcf86cd799439012",
  "message": "Hello, I'd like to discuss my workout plan"
}
```

---

### Get Chat History

**GET** `/api/chat/messages?with=:userId`

🔒 **Requires Authentication**

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| with | string | Yes | ID of the other user |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 50) |

---

### Mark Message as Read

**PATCH** `/api/chat/messages/:id/read`

🔒 **Requires Authentication**

---

### Get User Conversations

**GET** `/api/chat/conversations/:userId`

🔒 **Requires Authentication**

Returns all conversations with last message and unread count.

**Response (200 OK):**

```json
{
  "conversations": [
    {
      "partnerId": "507f1f77bcf86cd799439012",
      "partnerUsername": "instructor_jane",
      "partnerName": "Jane Smith",
      "partnerAvatar": "https://...",
      "lastMessage": {
        "message": "See you tomorrow!",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "isRead": true,
        "isSentByMe": false
      },
      "unreadCount": 2
    }
  ]
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting to prevent abuse.

## Pagination

Endpoints that return lists support pagination with these query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default varies by endpoint)

Paginated responses include:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "totalPages": 4
  }
}
```

## Timestamps

All resources include:

- `createdAt` - ISO 8601 timestamp of creation
- `updatedAt` - ISO 8601 timestamp of last update

## ObjectId Format

MongoDB ObjectIds are 24-character hexadecimal strings:

```
507f1f77bcf86cd799439011
```

Invalid ObjectIds will return a 400 Bad Request error.
