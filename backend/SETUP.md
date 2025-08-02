# TaskPilot API Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account for file uploads

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskPilot/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory with the following variables:
   
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/taskpilot
   
   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Cloudinary Setup**
   
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret from the dashboard
   - Update the `.env` file with your Cloudinary credentials

5. **MongoDB Setup**
   
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `taskpilot`
   - Update the `MONGODB_URI` in your `.env` file

6. **Start the server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8000`

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Health Check
```
GET /health
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/api/v1/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -F "fullName=ShuklaJi" \
  -F "email=shukla@example.com" \
  -F "username=shuklaji" \
  -F "password=Password123!" \
  -F "avtar=@/path/to/avatar.jpg"
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shukla@example.com",
    "username": "shuklaji",
    "password": "Password123!"
  }'
```

### 4. Create a Task
```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation for the new feature",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "assignedTo": "USER_ID"
  }'
```

### 5. Get All Tasks
```bash
curl -X GET "http://localhost:8000/api/v1/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Upload Document to Task
```bash
curl -X POST http://localhost:8000/api/v1/tasks/TASK_ID/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "document=@/path/to/document.pdf"
```

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  avtar: String (Cloudinary URL, required),
  password: String (hashed, required),
  refreshToken: String,
  role: String (default: "user"),
  tasks: [ObjectId] (references to Task model)
}
```

### Task Model
```javascript
{
  assignedTo: ObjectId (references User model, required),
  title: String (required, indexed),
  description: String (required),
  status: String (enum: ["pending", "in_progress", "completed"], default: "pending"),
  priority: String (enum: ["low", "medium", "high"], default: "medium"),
  dueDate: Date (required),
  documents: [String] (Cloudinary URLs)
}
```

## Features Implemented

### ✅ User Management
- User registration with avatar upload
- User login/logout with JWT tokens
- User CRUD operations (admin only for delete)
- Role-based access control (user/admin)
- Password hashing with bcrypt

### ✅ Task Management
- Complete CRUD operations for tasks
- Task assignment to users
- Status tracking (pending, in_progress, completed)
- Priority levels (low, medium, high)
- Due date management

### ✅ Advanced Features
- **Filtering**: By status, priority, assigned user, search terms
- **Sorting**: By any field in ascending/descending order
- **Pagination**: Configurable page size and navigation
- **Search**: Full-text search in task titles and descriptions

### ✅ File Management
- Document upload to tasks using Cloudinary
- Document removal from tasks
- Document information retrieval
- Secure document download URLs
- Support for multiple file types

### ✅ Security & Authorization
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure file upload handling
- CORS configuration

### ✅ API Features
- RESTful design principles
- Consistent error handling
- Standardized response format
- Health check endpoint
- Comprehensive API documentation

## Error Handling

The API returns consistent error responses:

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

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Use strong JWT secrets
5. Set up proper logging
6. Configure reverse proxy (nginx) if needed

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in `.env`

2. **Cloudinary Upload Errors**
   - Verify your Cloudinary credentials
   - Check file size limits

3. **JWT Token Issues**
   - Ensure `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set
   - Check token expiration settings

4. **CORS Errors**
   - Update `CORS_ORIGIN` in `.env` to match your frontend URL

### Logs
Check the console output for detailed error messages and debugging information. 