// frontend/src/services/learningBehaviorService.js
import api from './api';

export const learningBehaviorService = {
  getStats: async () => {
    try {
      const res = await api.get('/learning-behavior/stats');
      return res.data;
    } catch {
      return null;
    }
  },

  getOverview: async () => {
    try {
      const res = await api.get('/learning-behavior/overview');
      return res.data;
    } catch {
      return null;
    }
  }
};
