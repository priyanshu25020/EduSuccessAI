// backend/src/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/stats', attendanceController.getAttendanceStats);
router.get('/records', attendanceController.getAttendanceRecords);
router.post('/mark', attendanceController.markAttendance);
router.post('/bulk-upload', attendanceController.bulkUploadAttendance);
router.post('/action', attendanceController.takeAction);

module.exports = router;
