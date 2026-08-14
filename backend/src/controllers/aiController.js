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
