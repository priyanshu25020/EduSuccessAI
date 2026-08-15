// backend/src/routes/blockchainRoutes.js
const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');

// GET /api/blockchain/stats - Overview stats, contract address, block height
router.get('/stats', blockchainController.getBlockchainStats);

// POST /api/blockchain/verify - Verify student record integrity against on-chain hash
router.post('/verify', blockchainController.verifyStudentRecord);

// POST /api/blockchain/publish-attendance - Commit attendance batch hash to ledger
router.post('/publish-attendance', blockchainController.publishAttendanceBatch);

// POST /api/blockchain/log-intervention - Log counseling/intervention on-chain
router.post('/log-intervention', blockchainController.logIntervention);

// POST /api/blockchain/disburse-grant - Trigger smart contract scholarship disbursement
router.post('/disburse-grant', blockchainController.disburseSmartGrant);

// GET /api/blockchain/ledger - Get audit ledger entries
router.get('/ledger', blockchainController.getAuditLedger);

module.exports = router;
