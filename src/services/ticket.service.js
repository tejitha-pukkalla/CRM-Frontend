// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const getAuthHeader = () => {
//   const token = localStorage.getItem('token');
//   return { Authorization: `Bearer ${token}` };
// };

// const ticketService = {
//   // Create a new ticket
//   createTicket: async (ticketData) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/tickets`,
//         ticketData,
//         { headers: getAuthHeader() }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   // Get all tickets (SuperAdmin only)
//   getAllTickets: async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/tickets`,
//         { headers: getAuthHeader() }
//       );
//       return response.data; // keep as is if API returns array
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   // Get current user's tickets
//   getMyTickets: async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/tickets/my-tickets`,
//         { headers: getAuthHeader() }
//       );
//       return response.data; // keep as is if API returns array
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   // Update ticket status (SuperAdmin/TeamLead)
//   updateTicketStatus: async (ticketId, statusData) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/tickets/${ticketId}/status`,
//         statusData,
//         { headers: getAuthHeader() }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },
// };

// export default ticketService;


import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await axios.post(
        `${API_URL}/tickets`,
        ticketData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all tickets (SuperAdmin only)
  getAllTickets: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/tickets`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user's tickets
  getMyTickets: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/tickets/my-tickets`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get ticket by ID (for detailed view)
  getTicketById: async (ticketId) => {
    try {
      const response = await axios.get(
        `${API_URL}/tickets/${ticketId}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update ticket status (SuperAdmin/TeamLead)
  updateTicketStatus: async (ticketId, statusData) => {
    try {
      const response = await axios.put(
        `${API_URL}/tickets/${ticketId}/status`,
        statusData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept ticket (SuperAdmin only)
  acceptTicket: async (ticketId, acceptData) => {
    try {
      const response = await axios.put(
        `${API_URL}/tickets/${ticketId}/accept`,
        acceptData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject ticket (SuperAdmin only)
  rejectTicket: async (ticketId, rejectData) => {
    try {
      const response = await axios.put(
        `${API_URL}/tickets/${ticketId}/reject`,
        rejectData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default ticketService;