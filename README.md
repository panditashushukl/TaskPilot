# TaskPilot - Task Management Application

## 🚀 Overview

TaskPilot is a modern, full-stack task management application built with React and Node.js. It provides a comprehensive solution for managing and delegating tasks with real-time updates, file uploads, and user authentication.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure authentication with JWT tokens
- **Profile Management**: Update user profile with avatar upload via Cloudinary
- **Role-based Access**: User roles and permissions
- **Session Management**: Persistent login with refresh tokens

### 📋 Task Management
- **Create & Edit Tasks**: Full CRUD operations for tasks
- **Task Assignment**: Assign tasks to specific users
- **Status Tracking**: Track task progress (pending, in_progress, completed)
- **Priority Levels**: Set task priority (low, medium, high)
- **Due Date Management**: Set and track task deadlines
- **Task Filtering**: Filter tasks by status, priority, and date
- **Task Search**: Search tasks by title and description

### 📁 Document Management
- **File Upload**: Upload documents and attachments to tasks
- **Cloud Storage**: Secure file storage with Cloudinary integration
- **Document Preview**: View uploaded documents
- **File Organization**: Organize documents by task

### 📊 Dashboard & Analytics
- **Task Statistics**: Overview of task completion rates
- **Progress Tracking**: Visual progress indicators
- **Recent Tasks**: Quick access to recent activities
- **Performance Metrics**: User performance analytics

### 🔄 Real-time Features
- **WebSocket Integration**: Real-time task updates
- **Live Notifications**: Instant notifications for task changes
- **Collaborative Updates**: Real-time collaboration on tasks

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first responsive interface
- **Dark/Light Theme**: Theme customization
- **Smooth Animations**: Framer Motion animations
- **Toast Notifications**: User-friendly notifications
- **Loading States**: Optimized loading experiences

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **Socket.io Client**: Real-time communication
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation
- **React Dropzone**: File upload handling
- **Framer Motion**: Animation library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload middleware
- **Cloudinary**: Cloud file storage
- **Socket.io**: Real-time communication
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: Cookie handling
- **Dotenv**: Environment variable management

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server with auto-restart
- **Vite**: Frontend build tool

## 📁 Project Structure

```
TaskPilot/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── utils/          # Utility functions
│   │   ├── db/             # Database configuration
│   │   └── constants.js    # Application constants
│   └── public/             # Static files
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API and WebSocket services
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
└── README.md              # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update user profile

### Tasks
- `GET /api/v1/tasks` - Get all tasks (with filtering)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get specific task
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

### Documents
- `POST /api/v1/documents/upload` - Upload document
- `DELETE /api/v1/documents/:id` - Delete document

## 🚀 Getting Started

See the individual setup guides:
- [Backend Setup Guide](./backend/SETUP.md)
- [Frontend Setup Guide](./frontend/SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**ShuklaJi** - [GitHub](https://github.com/panditashushukl)

## 🐛 Issues

If you find any bugs or have feature requests, please [create an issue](https://github.com/panditashushukl/TaskPilot/issues).
