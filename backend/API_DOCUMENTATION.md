# TaskPilot API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## User Management

### Register User
**POST** `/users/register`

**Body (multipart/form-data):**
```json
{
  "fullName": "ShuklaJi",
  "email": "Shukla@example.com",
  "username": "ShuklaJi",
  "password": "Password123!",
  "role": "user" // optional, defaults to "user"
}
```

**Files:**
- `avtar`: Profile picture (required)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "ShuklaJi",
    "email": "Shukla@example.com",
    "username": "ShuklaJi",
    "role": "user",
    "avtar": "cloudinary_url",
    "coverImage": "cloudinary_url"
  },
  "message": "User Registered Successfully."
}
```

### Login User
**POST** `/users/login`

**Body:**
```json
{
  "email": "Shukla@example.com",
  "username": "ShuklaJi",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "ShuklaJi",
      "email": "Shukla@example.com",
      "username": "ShuklaJi",
      "role": "user"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "User logged In Successfully"
}
```

### Logout User
**POST** `/users/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out"
}
```

### Get All Users (Admin)
**GET** `/users?page=1&limit=10&search=Shukla&sortBy=createdAt&sortOrder=desc`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in username, email, fullName
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: asc/desc (default: desc)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  },
  "message": "Users retrieved successfully"
}
```

### Get User by ID
**GET** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "ShuklaJi",
    "email": "Shukla@example.com",
    "username": "ShuklaJi",
    "role": "user"
  },
  "message": "User retrieved successfully"
}
```

### Update User
**PUT** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "fullName": "Shukla Updated",
  "email": "Shukla.updated@example.com",
  "username": "Shuklaupdated",
  "role": "admin" // only admins can change roles
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "Shukla Updated",
    "email": "Shukla.updated@example.com",
    "username": "Shuklaupdated",
    "role": "admin"
  },
  "message": "User updated successfully"
}
```

### Delete User (Admin Only)
**DELETE** `/users/:userId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User deleted successfully"
}
```

## Task Management

### Create Task
**POST** `/tasks`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Complete Project Documentation",
  "description": "Write comprehensive documentation for the new feature",
  "status": "pending", // pending, in_progress, completed
  "priority": "high", // low, medium, high
  "dueDate": "2024-01-15T10:00:00.000Z",
  "assignedTo": "user_id"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "task_id",
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation for the new feature",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "assignedTo": {
      "_id": "user_id",
      "username": "ShuklaJi",
      "fullName": "ShuklaJi",
      "email": "Shukla@example.com"
    },
    "documents": []
  },
  "message": "Task created successfully"
}
```

### Get All Tasks
**GET** `/tasks?page=1&limit=10&search=documentation&status=pending&priority=high&assignedTo=user_id&sortBy=createdAt&sortOrder=desc`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in title and description
- `status`: Filter by status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high)
- `assignedTo`: Filter by assigned user ID
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: asc/desc (default: desc)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "tasks": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "message": "Tasks retrieved successfully"
}
```

### Get Task by ID
**GET** `/tasks/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "task_id",
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation for the new feature",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "assignedTo": {
      "_id": "user_id",
      "username": "ShuklaJi",
      "fullName": "ShuklaJi",
      "email": "Shukla@example.com"
    },
    "documents": ["cloudinary_url_1", "cloudinary_url_2"]
  },
  "message": "Task retrieved successfully"
}
```

### Update Task
**PUT** `/tasks/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "medium",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "assignedTo": "new_user_id"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "task_id",
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "medium",
    "dueDate": "2024-01-20T10:00:00.000Z",
    "assignedTo": {
      "_id": "new_user_id",
      "username": "janeJi",
      "fullName": "Jane Ji",
      "email": "jane@example.com"
    }
  },
  "message": "Task updated successfully"
}
```

### Delete Task
**DELETE** `/tasks/:taskId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Task deleted successfully"
}
```

### Get Task Statistics
**GET** `/tasks/stats?assignedTo=user_id`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `assignedTo`: User ID to get stats for (admin only)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "total": 25,
    "pending": 10,
    "inProgress": 8,
    "completed": 7,
    "highPriority": 5,
    "mediumPriority": 15,
    "lowPriority": 5
  },
  "message": "Task statistics retrieved successfully"
}
```

## Document Management

### Upload Document to Task
**POST** `/tasks/:taskId/documents`

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**
- `document`: File to upload

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "task_id",
    "title": "Task Title",
    "documents": ["cloudinary_url_1", "cloudinary_url_2", "new_document_url"]
  },
  "message": "Document uploaded successfully"
}
```

### Remove Document from Task
**DELETE** `/tasks/:taskId/documents`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "documentUrl": "cloudinary_url_to_remove"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "task_id",
    "title": "Task Title",
    "documents": ["remaining_document_url"]
  },
  "message": "Document removed successfully"
}
```

### Get Task Documents
**GET** `/documents/tasks/:taskId/documents`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "documents": [
      {
        "url": "cloudinary_url",
        "publicId": "cloudinary_public_id",
        "format": "pdf",
        "size": 1024000,
        "createdAt": "2024-01-10T10:00:00.000Z",
        "secureUrl": "https://secure_url"
      }
    ]
  },
  "message": "Task documents retrieved successfully"
}
```

### Get Document Info
**GET** `/documents/tasks/:taskId/documents/:documentUrl`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "url": "cloudinary_url",
    "publicId": "cloudinary_public_id",
    "format": "pdf",
    "size": 1024000,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "secureUrl": "https://secure_url"
  },
  "message": "Document info retrieved successfully"
}
```

### Download Document
**GET** `/documents/tasks/:taskId/documents/:documentUrl/download`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "downloadUrl": "https://cloudinary_download_url",
    "originalUrl": "original_cloudinary_url"
  },
  "message": "Download URL generated successfully"
}
```

## Health Check

### API Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "success",
  "message": "TaskPilot API is running",
  "timestamp": "2024-01-10T10:00:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Authentication & Authorization

### User Roles
- `user`: Regular user (can manage their own tasks)
- `admin`: Administrator (can manage all users and tasks)

### Permission Matrix

| Action | User | Admin |
|--------|------|-------|
| View own tasks | ✅ | ✅ |
| View all tasks | ❌ | ✅ |
| Create own tasks | ✅ | ✅ |
| Create tasks for others | ❌ | ✅ |
| Update own tasks | ✅ | ✅ |
| Update any task | ❌ | ✅ |
| Delete own tasks | ✅ | ✅ |
| Delete any task | ❌ | ✅ |
| Manage users | ❌ | ✅ |
| Upload documents to own tasks | ✅ | ✅ |
| Upload documents to any task | ❌ | ✅ | 