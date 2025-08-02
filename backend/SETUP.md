# Backend Setup Guide

## 📋 Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/panditashushukl/TaskPilot.git
cd TaskPilot/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Or create a new `.env` file with the following variables:

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
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Create database:
   ```bash
   mongosh
   use taskpilot
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Update the Cloudinary variables in your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── user.controller.js
│   │   ├── task.controller.js
│   │   └── document.controller.js
│   ├── models/              # Database models
│   │   ├── user.models.js
│   │   └── tasks.models.js
│   ├── routes/              # API routes
│   │   ├── user.routes.js
│   │   ├── task.routes.js
│   │   └── document.routes.js
│   ├── middlewares/         # Custom middlewares
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── db/                  # Database configuration
│   │   └── index.js
│   ├── constants.js         # Application constants
│   ├── app.js              # Express app configuration
│   └── index.js            # Server entry point
├── public/                 # Static files
├── package.json
└── .env                    # Environment variables
```

## 🔧 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "password123",
  "avatar": "data:image/jpeg;base64,..."
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/users/current-user
Authorization: Bearer <access_token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <access_token>
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "assignedTo": "user_id",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Update Task
```http
PATCH /api/v1/tasks/:taskId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "in_progress",
  "description": "Updated description"
}
```

### Document Endpoints

#### Upload Document
```http
POST /api/v1/documents/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <file_data>
```

## 🔒 Security Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Token expiration and refresh mechanism

### Authorization
- Role-based access control
- Protected routes with middleware
- User-specific data access

### File Upload Security
- File type validation
- File size limits
- Secure cloud storage with Cloudinary

## 🧪 Testing

### Manual Testing

You can test the API endpoints using tools like:
- **Postman** - [Download here](https://www.postman.com/)
- **Insomnia** - [Download here](https://insomnia.rest/)
- **cURL** - Command line tool

### Example cURL Commands

```bash
# Register a new user
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get tasks (replace <token> with actual token)
curl -X GET http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Solution:**
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify network connectivity

#### 2. JWT Token Error
```
Error: jwt malformed
```
**Solution:**
- Check your JWT secrets in `.env`
- Ensure tokens are properly formatted
- Verify token expiration

#### 3. Cloudinary Upload Error
```
Error: Cloudinary upload failed
```
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check file size and type restrictions
- Ensure proper file format

#### 4. CORS Error
```
Error: CORS policy blocked
```
**Solution:**
- Update `CORS_ORIGIN` in `.env`
- Add your frontend URL to allowed origins

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=app:*
```

## 📊 Monitoring

### Health Check
```http
GET /api/v1/health
```

### Logs
The application logs important events to the console. In production, consider using:
- **Winston** for structured logging
- **Morgan** for HTTP request logging
- **PM2** for process management

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=your_production_mongodb_uri
ACCESS_TOKEN_SECRET=your_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms

- **Heroku**: Easy deployment with Git integration
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS**: Scalable cloud deployment

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Support

If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Review the error logs
3. Create an issue on GitHub with detailed error information 