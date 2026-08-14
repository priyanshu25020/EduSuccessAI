// frontend/src/services/studentService.js
import api from './api';

export const studentService = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/students${query ? `?${query}` : ''}`);
      return res;
    } catch {
      return null;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      return res.data;
    } catch {
      return null;
    }
  },

  create: async (data) => {
    return await api.post('/students', data);
  },

  bulkCreate: async (students) => {
    return await api.post('/students/bulk', { students });
  },

  delete: async (id) => {
    return await api.delete(`/students/${id}`);
  }
};
