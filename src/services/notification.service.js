import api from './api';

export const notificationService = {
  // Get all notifications with filters
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error.response?.data || error;
    }
  },

  // Mark single notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error.response?.data || error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications', {
        params: { isRead: false, limit: 1 }
      });
      return response.data.unreadCount || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
};
