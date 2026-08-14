// frontend/src/services/socioEconomicService.js
import api from './api';

export const socioEconomicService = {
  getStats: async () => {
    try {
      const res = await api.get('/socio-economic/stats');
      return res.data;
    } catch {
      return null;
    }
  },

  getOverview: async () => {
    try {
      const res = await api.get('/socio-economic/overview');
      return res.data;
    } catch {
      return null;
    }
  }
};
