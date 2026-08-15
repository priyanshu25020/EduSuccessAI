// backend/src/controllers/predictionController.js
const predictionService = require('../services/predictionService');

exports.getPredictionOverview = (req, res) => {
  try {
    const result = predictionService.getPredictionOverview(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.simulateScenario = (req, res) => {
  try {
    const result = predictionService.simulateStudentScenario(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generatePrescription = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }
    const result = await predictionService.generateAiPrescription(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
