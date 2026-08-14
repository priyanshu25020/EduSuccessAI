// backend/src/routes/behaviorRoutes.js
const express = require('express');
const router = express.Router();
const behaviorController = require('../controllers/behaviorController');

router.get('/stats', behaviorController.getBehaviorStats);
router.get('/overview', behaviorController.getBehaviorOverview);

module.exports = router;
