import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
// Customer API calls
export const customerApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    console.log(response.data)
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  createCustomer: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/users/register/customer`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
};

// Loan API calls
export const loanApi = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await axios.get(`${API_BASE_URL}/loans`, {
      params: { page, limit, search },
      headers: getAuthHeaders()
    });
    return response.data;
  },



  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/loans/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/loans`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/loans/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },
  updateStatus: async (id: string, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/loans/${id}/status`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/loans/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  }
}; 