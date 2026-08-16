// backend/src/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze-risk', aiController.analyzeStudentRisk);
router.post('/generate-draft', aiController.generateDraftNotice);
router.post('/gemini-plan', aiController.generateGeminiPlan);

module.exports = router;
