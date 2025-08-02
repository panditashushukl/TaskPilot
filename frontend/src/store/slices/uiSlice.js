import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  modals: {
    createTask: false,
    editTask: false,
    deleteTask: false,
    uploadDocument: false,
  },
  notifications: [],
  theme: 'light',
  loadingStates: {
    global: false,
    tasks: false,
    auth: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    addNotification: (state, action) => {
      const { id, type, message, duration = 5000 } = action.payload;
      state.notifications.push({
        id,
        type,
        message,
        duration,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLoadingState: (state, action) => {
      const { key, loading } = action.payload;
      if (state.loadingStates.hasOwnProperty(key)) {
        state.loadingStates[key] = loading;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  setLoadingState,
} = uiSlice.actions;

export default uiSlice.reducer; 