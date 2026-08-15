// backend/src/controllers/blockchainController.js
const blockchainService = require('../services/blockchainService');
const { students } = require('../data/db');

// Initialize base student hashes on startup
blockchainService.initBaseCredentials(students);

exports.getBlockchainStats = (_req, res) => {
  try {
    const stats = blockchainService.getBlockchainStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyStudentRecord = (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData || (!studentData.id && !studentData.rollNo)) {
      return res.status(400).json({ success: false, message: 'Student ID or Roll No is required for verification' });
    }

    // Lookup in db if partial info was provided
    let target = students.find((s) => s.id === studentData.id || s.rollNo === studentData.rollNo);
    if (!target) {
      target = studentData;
    }

    const result = blockchainService.verifyStudentRecord(target);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publishAttendanceBatch = (req, res) => {
  try {
    const { date = '15 Aug 2026', studentCount = students.length } = req.body;
    const result = blockchainService.publishAttendanceBatch(date, studentCount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logIntervention = (req, res) => {
  try {
    const { studentId, studentName, counselorId, actionType, notes } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }
    const result = blockchainService.logInterventionOnChain({
      studentId,
      studentName,
      counselorId,
      actionType,
      notes
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.disburseSmartGrant = (req, res) => {
  try {
    const { studentId, studentName, amount, criteria, beneficiaryWallet } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }
    const result = blockchainService.releaseSmartGrant({
      studentId,
      studentName,
      amount,
      criteria,
      beneficiaryWallet
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditLedger = (req, res) => {
  try {
    const { type } = req.query;
    const result = blockchainService.getAuditLedger(type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
