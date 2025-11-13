// src/services/task.service.js
import api from './api';

const taskService = {
  // Create/Assign new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks with filters
  getAllTasks: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },


  // ADD THIS AFTER getAllTasks function
// Get MY tasks (assigned to me) - For Member, Project Lead, Team Lead
getMyTasks: async (filters = {}) => {
  try {
    const response = await api.get('/tasks/my-tasks', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// Get tasks assigned BY me
getAssignedByMe: async (filters = {}) => {
  try {
    const response = await api.get('/tasks/assigned-by-me', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

  // Get single task details
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Start working on task
  startTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/start`);
    return response.data;
  },

  // Add task update/progress
  addTaskUpdate: async (taskId, updateData) => {
    const response = await api.post(`/tasks/${taskId}/updates`, updateData);
    return response.data;
  },

  // Add subtask
  addSubtask: async (taskId, subtaskData) => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
    return response.data;
  },

  // Toggle subtask completion
  toggleSubtask: async (taskId, subtaskId) => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  },

  // Mark task as completed
  completeTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/complete`);
    return response.data;
  },

  // Reassign task
  reassignTask: async (taskId, reassignData) => {
    const response = await api.post(`/tasks/${taskId}/reassign`, reassignData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Start timer
  startTimer: async (taskId) => {
    const response = await api.post(`/time/${taskId}/start`);
    return response.data;
  },

  // Stop timer
  stopTimer: async (taskId) => {
    const response = await api.post(`/time/${taskId}/stop`);
    return response.data;
  },

  // Add manual time entry
  addManualTime: async (taskId, timeData) => {
    const response = await api.post(`/time/${taskId}/manual`, timeData);
    return response.data;
  }
};

export default taskService;