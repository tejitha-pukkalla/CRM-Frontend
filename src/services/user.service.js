// import api from './api';

// export const userService = {
//   // Get all users with filters
//   getAllUsers: async (filters = {}) => {
//     try {
//       const response = await api.get('/users', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get single user by ID
//   getUser: async (id) => {
//     try {
//       const response = await api.get(`/users/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update user
//   updateUser: async (id, userData) => {
//     try {
//       const response = await api.put(`/users/${id}`, userData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete/Deactivate user
//   deleteUser: async (id) => {
//     try {
//       const response = await api.delete(`/users/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get users by role
//   getUsersByRole: async (role) => {
//     try {
//       const response = await api.get(`/users/role/${role}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }
// };




import api from './api';

export const userService = {
  // Get all users with filters
  getAllUsers: async (filters = {}) => {
    try {
      const response = await api.get('/users', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single user by ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete/Deactivate user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 🆕 Reset user password to default
  resetPassword: async (id) => {
    try {
      const response = await api.put(`/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};