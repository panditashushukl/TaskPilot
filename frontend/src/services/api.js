import axios from 'axios';
import { store } from '../store';
import { setUser, clearUser } from '../store/slices/authSlice';

// Create axios instance
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - no need to manually add tokens since they're in httpOnly cookies
api.interceptors.request.use(
  (config) => {
    // Tokens are automatically sent via cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using the refresh token cookie
        const response = await axios.post(
          '/api/v1/users/refresh-token',
          {}, // No body needed, refresh token is in cookie
          { withCredentials: true }
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        store.dispatch(clearUser());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 401) {
      store.dispatch(clearUser());
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'avtar' || key === 'coverImage') {
          if (userData[key] instanceof File) {
            formData.append(key, userData[key]);
          }
        } else {
          formData.append(key, userData[key]);
        }
      }
    });
    
    return api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  login: (credentials) => {
    return api.post('/users/login', credentials);
  },

  logout: () => {
    return api.post('/users/logout');
  },

  getCurrentUser: () => {
    return api.get('/users/me');
  },

  refreshToken: (refreshToken) => {
    return api.post('/users/refresh-token', { refreshToken });
  },

  getAllUsers: () => {
    return api.get('/users');
  },

  getUserById: (userId) => {
    return api.get(`/users/${userId}`);
  },

  updateUser: (userId, userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'avtar' || key === 'coverImage') {
          if (userData[key] instanceof File) {
            formData.append(key, userData[key]);
          }
        } else {
          formData.append(key, userData[key]);
        }
      }
    });
    
    return api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },
};

// Task API
export const taskAPI = {
  getTasks: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/tasks?${queryParams.toString()}`);
  },

  getTaskById: (taskId) => {
    return api.get(`/tasks/${taskId}`);
  },

  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  updateTask: (taskId, taskData) => {
    return api.put(`/tasks/${taskId}`, taskData);
  },

  deleteTask: (taskId) => {
    return api.delete(`/tasks/${taskId}`);
  },

  uploadDocument: (taskId, file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return api.post(`/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  removeDocument: (taskId, documentUrl) => {
    return api.delete(`/tasks/${taskId}/documents`, {
      data: { documentUrl },
    });
  },

  getTaskStats: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    return api.get(`/tasks/stats?${queryParams.toString()}`);
  },
};

// Document API
export const documentAPI = {
  uploadDocument: (taskId, file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return api.post(`/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  removeDocument: (taskId, documentUrl) => {
    return api.delete(`/tasks/${taskId}/documents`, {
      data: { documentUrl },
    });
  },
};

export default api; 