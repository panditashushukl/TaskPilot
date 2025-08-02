# Frontend Setup Guide

## 📋 Prerequisites

Before setting up the frontend, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Backend API** - Make sure the backend is running (see [Backend Setup Guide](../backend/SETUP.md))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/panditashushukl/TaskPilot.git
cd TaskPilot/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the frontend root directory:

```bash
# Copy the example environment file (if available)
cp .env.example .env
```

Or create a new `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=http://localhost:8000

# Application Configuration
VITE_APP_NAME=TaskPilot
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_FILE_UPLOAD=true
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` with hot reload.

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Linting

```bash
npm run lint
```

This runs ESLint to check for code quality issues.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout/         # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Tasks/          # Task-related components
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskFilters.jsx
│   │   └── UI/             # UI components
│   │       ├── Button.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── Modal.jsx
│   ├── pages/              # Page components
│   │   ├── Auth/           # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard/      # Dashboard page
│   │   │   └── Dashboard.jsx
│   │   ├── Tasks/          # Task pages
│   │   │   ├── Tasks.jsx
│   │   │   └── TaskDetail.jsx
│   │   ├── Profile/        # Profile page
│   │   │   └── Profile.jsx
│   │   └── NotFound/       # 404 page
│   │       └── NotFound.jsx
│   ├── store/              # Redux store
│   │   ├── index.js        # Store configuration
│   │   └── slices/         # Redux slices
│   │       ├── authSlice.js
│   │       ├── taskSlice.js
│   │       └── uiSlice.js
│   ├── services/           # API and WebSocket services
│   │   ├── api.js          # API client
│   │   └── websocket.js    # WebSocket service
│   ├── assets/             # Static assets
│   │   └── react.svg
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   ├── index.css           # Global styles
│   └── App.css             # App-specific styles
├── public/                 # Public assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── eslint.config.js        # ESLint configuration
```

## 🎨 Styling & UI

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // ... other custom colors
      }
    },
  },
  plugins: [],
}
```

### Custom Components

The project includes several reusable UI components:

- **Button**: Styled button component with variants
- **Modal**: Reusable modal dialog
- **LoadingSpinner**: Loading indicator
- **TaskCard**: Task display card
- **TaskFilters**: Task filtering interface

## 🔧 Configuration

### Vite Configuration

The project uses Vite for fast development and building. Configuration in `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

### ESLint Configuration

Code quality is enforced with ESLint. Configuration in `eslint.config.js`:

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ... custom rules
    }
  }
]
```

## 🔄 State Management

### Redux Toolkit

The application uses Redux Toolkit for state management with the following slices:

#### Auth Slice (`store/slices/authSlice.js`)
- User authentication state
- Login/logout actions
- User profile management

#### Task Slice (`store/slices/taskSlice.js`)
- Task data management
- Task CRUD operations
- Task filtering and search

#### UI Slice (`store/slices/uiSlice.js`)
- Modal states
- Loading states
- UI interactions

### Usage Example

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/slices/taskSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Component logic
};
```

## 🌐 API Integration

### API Service (`services/api.js`)

The application uses Axios for API calls with interceptors for authentication:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### WebSocket Service (`services/websocket.js`)

Real-time features are handled with Socket.io:

```javascript
import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
```

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**:
   - Test user registration
   - Test login/logout
   - Test protected routes

2. **Task Management**:
   - Create new tasks
   - Edit existing tasks
   - Delete tasks
   - Filter and search tasks

3. **File Upload**:
   - Upload documents to tasks
   - View uploaded files
   - Delete uploaded files

4. **Real-time Features**:
   - Test WebSocket connections
   - Verify real-time updates

### Browser Testing

Test the application in different browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Error
```
Error: Network Error
```
**Solution:**
- Ensure backend is running on port 8000
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS configuration in backend

#### 2. Build Errors
```
Error: Build failed
```
**Solution:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for syntax errors in components
- Verify all imports are correct

#### 3. WebSocket Connection Error
```
Error: WebSocket connection failed
```
**Solution:**
- Ensure backend WebSocket server is running
- Check `VITE_WS_URL` in `.env`
- Verify authentication token

#### 4. Styling Issues
```
Tailwind classes not working
```
**Solution:**
- Restart the development server
- Check `tailwind.config.js` content paths
- Verify PostCSS configuration

### Development Tips

1. **Hot Reload**: The development server supports hot reload for instant updates
2. **Error Overlay**: Vite provides helpful error overlays during development
3. **Console Logs**: Use browser dev tools to debug issues
4. **Network Tab**: Monitor API calls in browser dev tools

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder.

### Deployment Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

#### GitHub Pages
1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/taskpilot",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_WS_URL=https://your-api-domain.com
VITE_APP_NAME=TaskPilot
VITE_APP_VERSION=1.0.0
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)

## 🤝 Support

If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify all environment variables are set correctly
4. Create an issue on GitHub with detailed error information 