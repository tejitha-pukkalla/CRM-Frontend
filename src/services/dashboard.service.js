// src/services/dashboard.service.js
import api from './api';

export const dashboardService = {
  // Get dashboard statistics based on user role
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent activities/notifications
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/activities', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};