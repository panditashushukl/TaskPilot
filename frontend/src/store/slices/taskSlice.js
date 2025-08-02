import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../../services/api';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTaskById(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(taskId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete task');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'tasks/uploadDocument',
  async ({ taskId, file }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.uploadDocument(taskId, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload document');
    }
  }
);

export const removeDocument = createAsyncThunk(
  'tasks/removeDocument',
  async ({ taskId, documentUrl }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.removeDocument(taskId, documentUrl);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove document');
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchTaskStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTaskStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch task stats');
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        priority: '',
        assignedTo: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    updateTaskInList: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    addTaskToList: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    removeTaskFromList: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    // Real-time updates
    updateTaskRealTime: (state, action) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task._id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
      }
      if (state.currentTask && state.currentTask._id === taskId) {
        state.currentTask = { ...state.currentTask, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data.tasks;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload.data;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        if (state.currentTask && state.currentTask._id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove document
      .addCase(removeDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDocument.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        if (state.currentTask && state.currentTask._id === updatedTask._id) {
          state.currentTask = updatedTask;
        }
      })
      .addCase(removeDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch task stats
      .addCase(fetchTaskStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  updateTaskInList,
  addTaskToList,
  removeTaskFromList,
  setCurrentTask,
  clearCurrentTask,
  updateTaskRealTime,
} = taskSlice.actions;

export default taskSlice.reducer; 