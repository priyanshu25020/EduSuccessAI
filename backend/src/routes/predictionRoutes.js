// backend/src/routes/predictionRoutes.js
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// GET /api/prediction/overview - Full predictive dropout metrics & student list
router.get('/overview', predictionController.getPredictionOverview);

// POST /api/prediction/simulate - Interactive What-If Scenario simulation
router.post('/simulate', predictionController.simulateScenario);

// POST /api/prediction/prescription - AI Personalized Retention Plan
router.post('/prescription', predictionController.generatePrescription);

module.exports = router;
