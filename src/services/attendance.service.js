// import axios from 'axios';
// import { API_CONFIG } from '../config/api.config';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_CONFIG.BASE_URL,
//   timeout: API_CONFIG.TIMEOUT,
//   headers: API_CONFIG.HEADERS
// });

// // Request interceptor - Add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - Handle errors
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // Server responded with error
//       const { status, data } = error.response;

//       switch (status) {
//         case 401:
//           // Unauthorized - Clear token and redirect to login
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           window.location.href = '/login';
//           break;
//         case 403:
//           // Forbidden
//           console.error('Access forbidden:', data.message);
//           break;
//         case 404:
//           console.error('Resource not found:', data.message);
//           break;
//         case 500:
//           console.error('Server error:', data.message);
//           break;
//       }

//       return Promise.reject(error.response.data);
//     } else if (error.request) {
//       // Request made but no response
//       console.error('Network error:', error.message);
//       return Promise.reject({
//         success: false,
//         message: 'Network error. Please check your connection.'
//       });
//     } else {
//       // Something else happened
//       console.error('Error:', error.message);
//       return Promise.reject({
//         success: false,
//         message: error.message
//       });
//     }
//   }
// );

// export default api;




// src/services/attendance.service.js
import api from './api'; // Your axios instance

const attendanceService = {
  // =============== USER ACTIONS ===============
  
  /**
   * Clock In
   */
  clockIn: async (location = {}) => {
    try {
      const response = await api.post('/attendance/clock-in', { location });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Clock Out
   */
  clockOut: async (location = {}) => {
    try {
      const response = await api.post('/attendance/clock-out', { location });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Start Break
   */
  startBreak: async (breakType = 'tea-break', notes = '') => {
    try {
      const response = await api.post('/attendance/break/start', {
        breakType,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * End Break
   */
  endBreak: async () => {
    try {
      const response = await api.post('/attendance/break/end');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get Current Status
   */
  getCurrentStatus: async () => {
    try {
      const response = await api.get('/attendance/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get My Attendance History
   */
  getMyAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance/my-history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // =============== ADMIN ACTIONS (SA & TL) ===============
  
  /**
   * Get All Attendance Records
   */
  getAllAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get Today's Attendance Report
   */
  getTodayAttendance: async () => {
    try {
      const response = await api.get('/attendance/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get Attendance Summary/Statistics
   */
  getAttendanceSummary: async (params = {}) => {
    try {
      const response = await api.get('/attendance/summary', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Manual Attendance Adjustment (SA & TL only)
   */
  adjustAttendance: async (id, data) => {
    try {
      const response = await api.put(`/attendance/${id}/adjust`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default attendanceService;

// Named exports for convenience
export const {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getCurrentStatus,
  getMyAttendance,
  getAllAttendance,
  getTodayAttendance,
  getAttendanceSummary,
  adjustAttendance
} = attendanceService;
