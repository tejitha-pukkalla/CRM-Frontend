import api from './api';

export const projectService = {
  // Get all projects with filters
  getAllProjects: async (filters = {}) => {
    try {
      const response = await api.get('/projects', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single project by ID
  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
   // ✅ NEW: Get project members
  getProjectMembers: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // ADD THIS AFTER getProjectMembers function
getAssignableMembers: async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/assignable-members`);
    return response.data;
  } catch (error) {
    throw error;
  }
},



  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add member to project
  addMember: async (projectId, memberData) => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
