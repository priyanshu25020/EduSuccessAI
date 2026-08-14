// backend/src/routes/academicRoutes.js
const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.get('/stats', academicController.getAcademicStats);
router.get('/overview', academicController.getAcademicOverview);

module.exports = router;
