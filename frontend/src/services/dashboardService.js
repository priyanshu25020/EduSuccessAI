// frontend/src/services/dashboardService.js
import api from './api';

export const dashboardService = {
  getStats: async () => {
    try {
      const res = await api.get('/dashboard/stats');
      return res.data;
    } catch {
      return null;
    }
  }
};
