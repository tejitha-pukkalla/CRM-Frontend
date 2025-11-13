import api from './api';

const approvalService = {
  getPendingApprovals: async () => {
    try {
      const response = await api.get('/approvals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveTask: async (taskId) => {
    try {
      const response = await api.post(`/approvals/${taskId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectTask: async (taskId, reason) => {
    try {
      const response = await api.post(`/approvals/${taskId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default approvalService;
