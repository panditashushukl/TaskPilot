import { io } from 'socket.io-client';
import { store } from '../store';
import { updateTaskRealTime } from '../store/slices/taskSlice';
import { addNotification } from '../store/slices/uiSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:8000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.socket.connect();
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    });

    // Task updates
    this.socket.on('task:updated', (data) => {
      console.log('Task updated:', data);
      store.dispatch(updateTaskRealTime({
        taskId: data.taskId,
        updates: data.updates,
      }));
      
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        message: `Task "${data.taskTitle}" has been updated`,
        duration: 3000,
      }));
    });

    this.socket.on('task:created', (data) => {
      console.log('Task created:', data);
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        message: `New task "${data.task.title}" has been created`,
        duration: 3000,
      }));
    });

    this.socket.on('task:deleted', (data) => {
      console.log('Task deleted:', data);
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'info',
        message: `Task "${data.taskTitle}" has been deleted`,
        duration: 3000,
      }));
    });

    // Document updates
    this.socket.on('document:uploaded', (data) => {
      console.log('Document uploaded:', data);
      store.dispatch(updateTaskRealTime({
        taskId: data.taskId,
        updates: { documents: data.documents },
      }));
      
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        message: `Document uploaded to task "${data.taskTitle}"`,
        duration: 3000,
      }));
    });

    this.socket.on('document:removed', (data) => {
      console.log('Document removed:', data);
      store.dispatch(updateTaskRealTime({
        taskId: data.taskId,
        updates: { documents: data.documents },
      }));
      
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'info',
        message: `Document removed from task "${data.taskTitle}"`,
        duration: 3000,
      }));
    });

    // User notifications
    this.socket.on('notification', (data) => {
      console.log('Notification received:', data);
      store.dispatch(addNotification({
        id: Date.now(),
        type: data.type || 'info',
        message: data.message,
        duration: data.duration || 5000,
      }));
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Connection error. Please refresh the page.',
        duration: 5000,
      }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  }

  // Join a task room for real-time updates
  joinTaskRoom(taskId) {
    this.emit('join:task', { taskId });
  }

  // Leave a task room
  leaveTaskRoom(taskId) {
    this.emit('leave:task', { taskId });
  }

  // Join user's personal room
  joinUserRoom(userId) {
    this.emit('join:user', { userId });
  }

  // Leave user's personal room
  leaveUserRoom(userId) {
    this.emit('leave:user', { userId });
  }

  // Send task update
  updateTask(taskId, updates) {
    this.emit('task:update', { taskId, updates });
  }

  // Send task creation
  createTask(taskData) {
    this.emit('task:create', taskData);
  }

  // Send task deletion
  deleteTask(taskId) {
    this.emit('task:delete', { taskId });
  }

  // Send document upload
  uploadDocument(taskId, documentData) {
    this.emit('document:upload', { taskId, documentData });
  }

  // Send document removal
  removeDocument(taskId, documentUrl) {
    this.emit('document:remove', { taskId, documentUrl });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 