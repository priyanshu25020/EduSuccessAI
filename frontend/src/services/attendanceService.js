// frontend/src/services/attendanceService.js
import api from './api';

export const attendanceService = {
  getStats: async () => {
    try {
      const res = await api.get('/attendance/stats');
      return res.data;
    } catch {
      return null;
    }
  },

  getRecords: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/attendance/records${query ? `?${query}` : ''}`);
      return res;
    } catch {
      return null;
    }
  },

  markAttendance: async (data) => {
    return await api.post('/attendance/mark', data);
  },

  bulkUpload: async (records) => {
    return await api.post('/attendance/bulk-upload', { records });
  },

  takeAction: async (data) => {
    return await api.post('/attendance/action', data);
  }
};
