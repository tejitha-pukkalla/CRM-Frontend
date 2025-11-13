import api from './api';

const timeLogService = {
  // Start automatic timer
  startTimer: async (taskId) => {
    try {
      const response = await api.post(`/time/${taskId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Stop automatic timer
  stopTimer: async (taskId) => {
    try {
      const response = await api.post(`/time/${taskId}/stop`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add manual time entry - FIXED ROUTE
  addManualTime: async (taskId, timeData) => {
    try {
      // Route should match backend: /api/time/:id/manual
      const response = await api.post(`/time/${taskId}/manual`, timeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get time logs for a task - FIXED ENDPOINT
  getTaskTimeLogs: async (taskId) => {
    try {
      const response = await api.get(`/time/${taskId}/logs`);
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all time logs for user
  getUserTimeLogs: async (params = {}) => {
    try {
      const response = await api.get('/time/logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default timeLogService;