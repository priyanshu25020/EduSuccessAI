// backend/src/routes/socioEconomicRoutes.js
const express = require('express');
const router = express.Router();
const socioEconomicController = require('../controllers/socioEconomicController');

router.get('/stats', socioEconomicController.getSocioEconomicStats);
router.get('/overview', socioEconomicController.getSocioEconomicOverview);

module.exports = router;
