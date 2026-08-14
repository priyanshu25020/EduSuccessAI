// frontend/src/services/aiService.js
import api from './api';

export const aiService = {
  analyzeRisk: async (studentData) => {
    try {
      const res = await api.post('/ai/analyze-risk', studentData);
      return res.data;
    } catch {
      return null;
    }
  },

  generateDraft: async (studentData, type = 'letter') => {
    try {
      const res = await api.post('/ai/generate-draft', { studentData, type });
      return res.data;
    } catch {
      return null;
    }
  }
};
