// import api from './api';

// export const authService = {
//   // Login
//   login: async (email, password) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Register/Create new user (Protected - only Superadmin/Team Lead)
//   register: async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get current logged in user
//   getMe: async () => {
//     try {
//       const response = await api.get('/auth/me');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Logout (client-side only)
//   logout: () => {
//     localStorage.removeItem('token');
//   }
// };







import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register/Create new user (Protected - only Superadmin/Team Lead)
  // NOW RETURNS: { user, defaultPassword }
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current logged in user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
  }
};
