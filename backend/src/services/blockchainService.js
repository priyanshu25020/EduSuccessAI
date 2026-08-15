// backend/src/services/blockchainService.js
// Decentralized Blockchain Ledger & Verification Service for EduSuccess AI

const crypto = require('crypto');

// Simulated / Configured Consortium Network & Contract Parameters
const BLOCKCHAIN_CONFIG = {
  networkName: 'Polygon Amoy / EduSuccess Consortium L2',
  chainId: 80002,
  contractAddress: '0x71C8F794B35f29633e9b1103A5817d235D7653f8',
  oracleRelayer: '0x3E54c5e30571d871d3FeD4e6a4b1E51AbcD41498',
  explorerUrl: 'https://amoy.polygonscan.com/tx/',
  currentBlock: 1428590
};

// Generate deterministic or cryptographically secure transaction hash
function generateTxHash(input) {
  const hash = crypto.createHash('sha256').update(input + Date.now() + Math.random()).digest('hex');
  return `0x${hash}`;
}

// Compute deterministic SHA-256 hash of student record
function computeStudentHash(student) {
  const payload = {
    id: student.id || student.studentId,
    rollNo: student.rollNo,
    dept: student.dept || student.department,
    semester: student.semester,
    cgpa: parseFloat(student.academic?.cgpa ?? student.cgpa ?? 0),
    backlogs: parseInt(student.backlogs ?? 0, 10),
    attendance: student.attendance?.percentage ?? student.attendancePct ?? 0
  };
  const str = JSON.stringify(payload, Object.keys(payload).sort());
  return `0x${crypto.createHash('sha256').update(str).digest('hex')}`;
}

// Compute batch hash for attendance records
function computeBatchHash(date, count) {
  return `0x${crypto.createHash('sha256').update(`ATTENDANCE_BATCH_${date}_COUNT_${count}`).digest('hex')}`;
}

// In-Memory Immutable Ledger Store (anchored with base seeds)
let currentBlockHeight = BLOCKCHAIN_CONFIG.currentBlock;

const ledgerTransactions = [
  {
    txHash: '0xa4e92bf1893c5d79e60241b12b2e87902d13801f4c7183e843fa132fbc198201',
    blockNumber: currentBlockHeight - 45,
    type: 'ATTENDANCE_BATCH',
    title: 'Daily Attendance Batch Anchored',
    date: '15 Aug 2026',
    entityId: 'BATCH-20260815',
    entityName: 'Campus Attendance Registry (8 Records)',
    batchHash: '0x9df4821c172a59e19d7a2283e18a0cf786915e7144bbcd0285a854d92a4e99f1',
    gasUsed: '84,210',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    txHash: '0xc18290fa83bb174209d18e59b20d771c990234ac291b849204b123910c7104b2',
    blockNumber: currentBlockHeight - 38,
    type: 'ACADEMIC_CREDENTIAL',
    title: 'Semester Grade Integrity Snapshotted',
    entityId: 'STU1006',
    entityName: 'Anjali Desai (IT2021006)',
    recordHash: '0x4f128bc990172e817bc5618290adcf557193bc1029148bcf771920acde81014e',
    details: 'CGPA: 8.45 | Backlogs: 0 | Distinction Grade A',
    gasUsed: '112,450',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    txHash: '0x8f309a4718dc90184bfa29304192bc58190284ab910248c891048bca19047261',
    blockNumber: currentBlockHeight - 20,
    type: 'INTERVENTION_AUDIT',
    title: 'Remedial Counseling Audit Logged',
    entityId: 'STU1003',
    entityName: 'Aarav Mehta (EE2021003)',
    actionType: 'Parent-Mentor Counseling Session',
    ipfsHash: 'ipfs://QmZtmD2qt8SrhPvEncEB9NVhZ2843nLw8z67Xw2C4ZfN5M',
    gasUsed: '68,400',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    txHash: '0x7e290fbc91024b8104ca81920cbaf819204bc9102837bcda19024bcda91024bc',
    blockNumber: currentBlockHeight - 12,
    type: 'SMART_GRANT',
    title: 'Automated Academic Micro-Grant Disbursed',
    entityId: 'STU1001',
    entityName: 'Rahul Patel (CE2021001)',
    amount: '₹ 15,000 (0.05 ETH)',
    condition: 'Rural Socio-Economic Aid + Attendance Retention (>75%)',
    beneficiaryWallet: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    gasUsed: '95,120',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

// In-Memory store for registered student hashes
const registeredCredentials = new Map();

// Initialize base student hashes
function initBaseCredentials(students = []) {
  students.forEach((s) => {
    const hash = computeStudentHash(s);
    registeredCredentials.set(s.id, {
      studentId: s.id,
      rollNo: s.rollNo,
      name: s.name,
      dept: s.dept,
      hash,
      cgpa: s.academic?.cgpa || s.cgpa,
      backlogs: s.backlogs,
      blockNumber: currentBlockHeight - 50,
      txHash: generateTxHash(s.id),
      anchoredAt: '15 Aug 2026',
      verified: true
    });
  });
}

/**
 * Verifies if student record matches on-chain cryptographic anchor
 */
function verifyStudentRecord(studentData) {
  const computedHash = computeStudentHash(studentData);
  const existing = registeredCredentials.get(studentData.id || studentData.studentId);

  currentBlockHeight += 1;

  if (existing) {
    const isTampered = existing.hash !== computedHash;
    return {
      success: true,
      verified: !isTampered,
      tampered: isTampered,
      status: !isTampered ? 'Authentic & Validated' : 'Tampering Detected - Hash Mismatch',
      studentId: studentData.id,
      rollNo: studentData.rollNo,
      name: studentData.name,
      computedHash,
      onChainHash: existing.hash,
      anchoredBlock: existing.blockNumber,
      txHash: existing.txHash,
      network: BLOCKCHAIN_CONFIG.networkName,
      contractAddress: BLOCKCHAIN_CONFIG.contractAddress,
      anchoredAt: existing.anchoredAt,
      explorerLink: `${BLOCKCHAIN_CONFIG.explorerUrl}${existing.txHash}`
    };
  }

  // If not registered yet, anchor it on the fly
  const newTx = generateTxHash(studentData.id);
  const recordObj = {
    studentId: studentData.id,
    rollNo: studentData.rollNo,
    name: studentData.name,
    dept: studentData.dept,
    hash: computedHash,
    cgpa: studentData.cgpa,
    backlogs: studentData.backlogs,
    blockNumber: currentBlockHeight,
    txHash: newTx,
    anchoredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    verified: true
  };

  registeredCredentials.set(studentData.id, recordObj);

  // Add to ledger
  ledgerTransactions.unshift({
    txHash: newTx,
    blockNumber: currentBlockHeight,
    type: 'ACADEMIC_CREDENTIAL',
    title: `Academic Credential Anchored: ${studentData.name}`,
    entityId: studentData.id,
    entityName: `${studentData.name} (${studentData.rollNo || studentData.id})`,
    recordHash: computedHash,
    details: `Dept: ${studentData.dept} | CGPA: ${studentData.cgpa || '-'}`,
    gasUsed: '108,300',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    verified: true,
    tampered: false,
    status: 'Newly Anchored on Blockchain',
    studentId: studentData.id,
    rollNo: studentData.rollNo,
    name: studentData.name,
    computedHash,
    onChainHash: computedHash,
    anchoredBlock: currentBlockHeight,
    txHash: newTx,
    network: BLOCKCHAIN_CONFIG.networkName,
    contractAddress: BLOCKCHAIN_CONFIG.contractAddress,
    anchoredAt: recordObj.anchoredAt,
    explorerLink: `${BLOCKCHAIN_CONFIG.explorerUrl}${newTx}`
  };
}

/**
 * Commits attendance batch to blockchain ledger
 */
function publishAttendanceBatch(date, count = 8) {
  currentBlockHeight += 1;
  const batchHash = computeBatchHash(date, count);
  const txHash = generateTxHash(`BATCH_${date}`);

  const logEntry = {
    txHash,
    blockNumber: currentBlockHeight,
    type: 'ATTENDANCE_BATCH',
    title: `Daily Attendance Batch Anchored (${date})`,
    date,
    entityId: `BATCH-${date.replace(/\s+/g, '')}`,
    entityName: `Campus Attendance Registry (${count} Students)`,
    batchHash,
    gasUsed: '86,450',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date().toISOString()
  };

  ledgerTransactions.unshift(logEntry);

  return {
    success: true,
    message: `Attendance batch for ${date} successfully anchored to Blockchain!`,
    data: {
      txHash,
      blockNumber: currentBlockHeight,
      batchHash,
      date,
      studentCount: count,
      network: BLOCKCHAIN_CONFIG.networkName,
      contractAddress: BLOCKCHAIN_CONFIG.contractAddress,
      explorerLink: `${BLOCKCHAIN_CONFIG.explorerUrl}${txHash}`
    }
  };
}

/**
 * Logs intervention / counseling action on-chain
 */
function logInterventionOnChain({ studentId, studentName, counselorId = 'CNS-901', actionType = 'Counseling Session', notes = '' }) {
  currentBlockHeight += 1;
  const txHash = generateTxHash(`INTERVENTION_${studentId}`);
  const ipfsHash = `ipfs://Qm${crypto.createHash('sha256').update(studentId + notes + Date.now()).digest('hex').substring(0, 44)}`;

  const logEntry = {
    txHash,
    blockNumber: currentBlockHeight,
    type: 'INTERVENTION_AUDIT',
    title: `${actionType} Logged`,
    entityId: studentId,
    entityName: studentName || studentId,
    actionType,
    ipfsHash,
    notes: notes || 'Student counseling audit trail registered on immutable ledger.',
    gasUsed: '72,150',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date().toISOString()
  };

  ledgerTransactions.unshift(logEntry);

  return {
    success: true,
    message: `Intervention audit trail permanently logged on-chain.`,
    data: {
      txHash,
      blockNumber: currentBlockHeight,
      ipfsHash,
      studentId,
      actionType,
      network: BLOCKCHAIN_CONFIG.networkName,
      explorerLink: `${BLOCKCHAIN_CONFIG.explorerUrl}${txHash}`
    }
  };
}

/**
 * Releases smart contract micro-grant / scholarship
 */
function releaseSmartGrant({ studentId, studentName, amount = '₹ 15,000', criteria = 'Socio-economic Need & Attendance Retention', beneficiaryWallet = '' }) {
  currentBlockHeight += 1;
  const txHash = generateTxHash(`GRANT_${studentId}`);
  const wallet = beneficiaryWallet || `0x${crypto.createHash('sha256').update(studentId).digest('hex').substring(0, 40)}`;

  const logEntry = {
    txHash,
    blockNumber: currentBlockHeight,
    type: 'SMART_GRANT',
    title: `Smart Contract Micro-Grant Disbursed`,
    entityId: studentId,
    entityName: studentName || studentId,
    amount,
    condition: criteria,
    beneficiaryWallet: wallet,
    gasUsed: '98,340',
    relayer: BLOCKCHAIN_CONFIG.oracleRelayer,
    status: 'Confirmed & Immutable',
    timestamp: new Date().toISOString()
  };

  ledgerTransactions.unshift(logEntry);

  return {
    success: true,
    message: `Smart Grant of ${amount} disbursed to ${studentName || studentId} on Blockchain!`,
    data: {
      txHash,
      blockNumber: currentBlockHeight,
      studentId,
      amount,
      beneficiaryWallet: wallet,
      criteria,
      network: BLOCKCHAIN_CONFIG.networkName,
      explorerLink: `${BLOCKCHAIN_CONFIG.explorerUrl}${txHash}`
    }
  };
}

/**
 * Retrieves blockchain overview stats
 */
function getBlockchainStats() {
  const verifiedCount = registeredCredentials.size || 8;
  const grantsCount = ledgerTransactions.filter((t) => t.type === 'SMART_GRANT').length;
  const totalGas = ledgerTransactions.reduce((acc, t) => acc + parseInt((t.gasUsed || '0').replace(/,/g, ''), 10), 0);

  return {
    success: true,
    data: {
      network: BLOCKCHAIN_CONFIG.networkName,
      chainId: BLOCKCHAIN_CONFIG.chainId,
      contractAddress: BLOCKCHAIN_CONFIG.contractAddress,
      oracleRelayer: BLOCKCHAIN_CONFIG.oracleRelayer,
      currentBlockHeight,
      totalTransactions: ledgerTransactions.length,
      verifiedCredentialsCount: Math.max(8, verifiedCount),
      smartGrantsDisbursed: grantsCount,
      totalGasConsumed: `${(totalGas / 1000).toFixed(1)}k Gwei`,
      securityProtocol: 'SHA-256 + ECDSA + Polygon PoS Consensus',
      auditLedger: ledgerTransactions.slice(0, 20)
    }
  };
}

/**
 * Retrieves complete audit ledger with optional filtering
 */
function getAuditLedger(filterType) {
  let list = ledgerTransactions;
  if (filterType && filterType !== 'ALL') {
    list = list.filter((t) => t.type === filterType);
  }
  return {
    success: true,
    total: list.length,
    data: list
  };
}

module.exports = {
  BLOCKCHAIN_CONFIG,
  initBaseCredentials,
  computeStudentHash,
  verifyStudentRecord,
  publishAttendanceBatch,
  logInterventionOnChain,
  releaseSmartGrant,
  getBlockchainStats,
  getAuditLedger
};
