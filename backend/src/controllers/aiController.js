// backend/src/controllers/aiController.js
const aiService = require('../services/aiService');

exports.analyzeStudentRisk = async (req, res) => {
  try {
    const studentData = req.body;
    const result = await aiService.predictStudentRisk(studentData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateDraftNotice = async (req, res) => {
  try {
    const { studentData, type } = req.body;
    const result = await aiService.generateInterventionDraft(studentData, type);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateGeminiPlan = async (req, res) => {
  try {
    const { studentProfile, apiKey } = req.body;
    const clientKey = apiKey || req.headers['x-gemini-key'] || '';
    const result = await aiService.generateGeminiRetentionPlan(studentProfile, clientKey);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

