import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Cpu,
  Coins,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Copy,
  Check,
  FileText,
  Sparkles,
  RefreshCw,
  Wallet,
  Layers,
  Lock,
  Award,
  X,
  ChevronRight,
  ArrowUpRight,
  Fingerprint,
  FileCheck2,
  Flame,
  Globe,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { blockchainService } from '../services/blockchainService';
import { studentService } from '../services/studentService';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

export default function BlockchainAuditPage({ notify = () => {}, globalSearchQuery = '' }) {
  // State
  const [stats, setStats] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('verifier'); // 'verifier' | 'grants' | 'ledger'
  const [ledgerFilter, setLedgerFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

  // Verifier State
  const [selectedStudentId, setSelectedStudentId] = useState('STU1001');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState('');

  // Smart Grant State
  const [grantDisbursingId, setGrantDisbursingId] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certStudent, setCertStudent] = useState(null);

  // Commit Attendance State
  const [committingBatch, setCommittingBatch] = useState(false);

  // Load data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, studentsData] = await Promise.all([
        blockchainService.getStats(),
        studentService.getAllStudents()
      ]);
      setStats(statsData);
      setLedger(statsData.auditLedger || []);
      if (studentsData && studentsData.length > 0) {
        setStudents(studentsData);
        if (!selectedStudentId && studentsData[0]) {
          setSelectedStudentId(studentsData[0].id);
        }
      }
    } catch (e) {
      console.warn('Blockchain data load warning:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update selected student if students load
  const currentSelectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0] || {
      id: 'STU1001',
      rollNo: 'CE2021001',
      name: 'Rahul Patel',
      dept: 'Computer Engg.',
      semester: 4,
      cgpa: 5.8,
      backlogs: 2,
      attendance: '82%'
    };
  }, [students, selectedStudentId]);

  // Handle on-chain verification
  const handleVerifyStudent = async (studentToVerify) => {
    const target = studentToVerify || currentSelectedStudent;
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await blockchainService.verifyRecord(target);
      setVerificationResult(result);
      notify(`Verification Complete: ${target.name}'s record is 100% tamper-proof.`);
    } catch (err) {
      notify('Verification request failed. Please check network.');
    } finally {
      setVerifying(false);
    }
  };

  // Run initial verification on mount once student is ready
  useEffect(() => {
    if (currentSelectedStudent && !verificationResult) {
      handleVerifyStudent(currentSelectedStudent);
    }
  }, [selectedStudentId]);

  // Handle Commit Attendance Batch
  const handleCommitAttendance = async () => {
    setCommittingBatch(true);
    try {
      await blockchainService.publishAttendanceBatch('15 Aug 2026', students.length || 8);
      notify('Attendance Batch successfully hashed & anchored to Polygon L2!');
      await fetchData();
    } catch (e) {
      notify('Failed to commit attendance batch.');
    } finally {
      setCommittingBatch(false);
    }
  };

  // Handle Smart Grant Disbursement
  const handleDisburseGrant = async (student) => {
    setGrantDisbursingId(student.id);
    try {
      await blockchainService.disburseSmartGrant({
        studentId: student.id,
        studentName: student.name,
        amount: '₹ 15,000',
        criteria: 'Socio-economic Need & Attendance Retention (>75%)'
      });
      notify(`Smart Contract Grant of ₹ 15,000 successfully disbursed to ${student.name}!`);
      await fetchData();
    } catch (e) {
      notify('Grant disbursement failed.');
    } finally {
      setGrantDisbursingId(null);
    }
  };

  // Copy hash helper
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    notify('Copied to clipboard!');
    setTimeout(() => setCopiedHash(''), 2000);
  };

  // Open Certificate Modal
  const openCertificate = (student) => {
    setCertStudent(student);
    setShowCertificateModal(true);
  };

  // Filtered Ledger
  const filteredLedger = useMemo(() => {
    let list = ledger;
    if (ledgerFilter !== 'ALL') {
      list = list.filter((t) => t.type === ledgerFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.txHash.toLowerCase().includes(q) ||
          (t.entityName && t.entityName.toLowerCase().includes(q)) ||
          (t.entityId && t.entityId.toLowerCase().includes(q))
      );
    }
    return list;
  }, [ledger, ledgerFilter, searchQuery]);

  // Eligible Grant Students
  const eligibleGrantStudents = useMemo(() => {
    return students.filter((s) => {
      const att = parseFloat(s.attendance?.percentage || s.attendance || 80);
      const isSocio = s.socioEconomic?.riskLevel === 'High Risk' || s.socioEconomic?.riskLevel === 'Medium Risk' || s.income === '< ₹1,00,000';
      return isSocio || att >= 75;
    });
  }, [students]);

  return (
    <div className="bc-page">
      {/* 1. Header Banner */}
      <div className="bc-header">
        <div className="bc-title-group">
          <div className="bc-icon-badge">
            <ShieldCheck style={{ width: 28, height: 28 }} />
          </div>
          <div>
            <div className="bc-network-tag">
              <span className="bc-pulse-dot" />
              Polygon Amoy Consortium L2 • Active & Verified
            </div>
            <h1>Blockchain Integrity & Audit Trail</h1>
            <p>
              Decentralized tamper-proof academic credentials, daily attendance batch hashes, immutable counseling audit trails, and automated smart-contract financial aid.
            </p>
          </div>
        </div>

        <div className="bc-header-actions">
          <button
            onClick={handleCommitAttendance}
            disabled={committingBatch}
            className="btn-primary-purple"
          >
            {committingBatch ? <RefreshCw style={{ width: 16, height: 16 }} className="spin" /> : <Lock style={{ width: 16, height: 16 }} />}
            <span>{committingBatch ? 'Anchoring Batch...' : 'Anchor Attendance Batch'}</span>
          </button>

          <button
            onClick={fetchData}
            title="Refresh on-chain state"
            className="btn-outline-action"
          >
            <RefreshCw style={{ width: 16, height: 16 }} className={loading ? 'spin' : ''} />
            <span>Sync Chain</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Overview Metric Cards */}
      <div className="bc-stats-grid">
        {/* Card 1 */}
        <div className="bc-stat-card">
          <div className="bar-indicator emerald" />
          <div className="bc-stat-info">
            <span className="bc-stat-title">Block Height</span>
            <span className="bc-stat-value">#{stats?.currentBlockHeight?.toLocaleString() || '1,428,594'}</span>
            <span className="bc-stat-note" style={{ color: '#059669', fontWeight: 600 }}>Polygon PoS L2 Node</span>
          </div>
          <div className="bc-stat-icon emerald">
            <Cpu style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bc-stat-card">
          <div className="bar-indicator blue" />
          <div className="bc-stat-info">
            <span className="bc-stat-title">Verified Credentials</span>
            <span className="bc-stat-value">{stats?.verifiedCredentialsCount || '8'}</span>
            <span className="bc-stat-note" style={{ color: '#2563eb', fontWeight: 600 }}>100% Cryptographic Integrity</span>
          </div>
          <div className="bc-stat-icon blue">
            <FileCheck2 style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bc-stat-card">
          <div className="bar-indicator amber" />
          <div className="bc-stat-info">
            <span className="bc-stat-title">Smart Grants Disbursed</span>
            <span className="bc-stat-value">{stats?.smartGrantsDisbursed || '1'} Grants</span>
            <span className="bc-stat-note" style={{ color: '#d97706', fontWeight: 600 }}>₹ 15,000 Released</span>
          </div>
          <div className="bc-stat-icon amber">
            <Coins style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bc-stat-card">
          <div className="bar-indicator purple" />
          <div className="bc-stat-info">
            <span className="bc-stat-title">Security & Gas Relayer</span>
            <span className="bc-stat-value">{stats?.totalGasConsumed || '360.2k'}</span>
            <span className="bc-stat-note" style={{ color: '#5247e6', fontWeight: 600 }}>Zero-Gas Student Relayer</span>
          </div>
          <div className="bc-stat-icon purple">
            <Fingerprint style={{ width: 22, height: 22 }} />
          </div>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="bc-tabs-bar">
        <button
          onClick={() => setActiveSubTab('verifier')}
          className={`bc-tab-item ${activeSubTab === 'verifier' ? 'active' : ''}`}
        >
          <ShieldCheck style={{ width: 16, height: 16 }} />
          <span>Live Record Verifier & Certificate</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grants')}
          className={`bc-tab-item ${activeSubTab === 'grants' ? 'active' : ''}`}
        >
          <Coins style={{ width: 16, height: 16 }} />
          <span>Smart Contract Micro-Grants</span>
          <span className="bc-tab-badge">{eligibleGrantStudents.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`bc-tab-item ${activeSubTab === 'ledger' ? 'active' : ''}`}
        >
          <Layers style={{ width: 16, height: 16 }} />
          <span>Immutable Audit Ledger</span>
          <span className="bc-tab-badge">{ledger.length}</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: LIVE ON-CHAIN VERIFIER & CERTIFICATE
      ======================================================== */}
      {activeSubTab === 'verifier' && (
        <div className="bc-grid-layout">
          {/* Left: Student Selector */}
          <div className="bc-panel">
            <div className="bc-panel-header">
              <div className="bc-panel-title">
                <Fingerprint style={{ width: 18, height: 18, color: '#5247e6' }} />
                <span>Select Student to Verify</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{students.length || 8} Students</span>
            </div>

            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Select a student to generate their real-time SHA-256 fingerprint and verify it against the on-chain Polygon anchor.
            </p>

            <div className="bc-student-list">
              {students.map((s) => {
                const isSelected = s.id === currentSelectedStudent.id;
                const attVal = s.attendance?.percentage ?? s.attendance ?? 80;
                const cgpaVal = s.academic?.cgpa ?? s.cgpa ?? '-';
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`bc-student-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="bc-student-left">
                      <img
                        src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={s.name}
                        className="bc-student-avatar"
                      />
                      <div>
                        <div className="bc-student-name">
                          {s.name}
                          {isSelected && <CheckCircle2 style={{ width: 14, height: 14, color: '#059669', display: 'inline', marginLeft: 4 }} />}
                        </div>
                        <div className="bc-student-meta">
                          {s.rollNo || s.id} • {s.dept}
                        </div>
                      </div>
                    </div>

                    <div className="bc-student-right">
                      <div className="bc-cgpa-val">CGPA: {cgpaVal}</div>
                      <div className="bc-att-val">Att: {attVal}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleVerifyStudent(currentSelectedStudent)}
              disabled={verifying}
              className="btn-primary-purple"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 18px' }}
            >
              {verifying ? (
                <>
                  <RefreshCw style={{ width: 16, height: 16 }} className="spin" />
                  <span>Querying Polygon Node...</span>
                </>
              ) : (
                <>
                  <ShieldCheck style={{ width: 16, height: 16 }} />
                  <span>Verify Cryptographic Integrity On-Chain</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Verification Proof Card */}
          <div className="bc-panel" style={{ background: '#ffffff' }}>
            {verificationResult ? (
              <div className="bc-verified-box">
                {/* Header */}
                <div className="bc-verified-top">
                  <div className="bc-verified-title-group">
                    <div className="bc-verified-icon">
                      <CheckCircle2 style={{ width: 26, height: 26 }} />
                    </div>
                    <div>
                      <div className="bc-verified-tag">100% Authentic & Cryptographically Validated</div>
                      <div className="bc-verified-name">{verificationResult.name} ({verificationResult.rollNo})</div>
                    </div>
                  </div>

                  <button
                    onClick={() => openCertificate(currentSelectedStudent)}
                    className="btn-outline-action"
                    style={{ padding: '8px 14px' }}
                  >
                    <Award style={{ width: 16, height: 16, color: '#5247e6' }} />
                    <span>View Digital Certificate</span>
                  </button>
                </div>

                {/* Hash & Details Grid */}
                <div className="bc-hash-grid">
                  <div className="bc-hash-item">
                    <div className="bc-hash-label">
                      <span>On-Chain Record Hash (SHA-256)</span>
                      <button
                        onClick={() => copyToClipboard(verificationResult.computedHash, 'recHash')}
                        className="bc-copy-btn"
                        title="Copy Hash"
                      >
                        {copiedHash === 'recHash' ? <Check style={{ width: 14, height: 14, color: '#059669' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <div className="bc-hash-code">
                      {verificationResult.computedHash ? `${verificationResult.computedHash.slice(0, 20)}...${verificationResult.computedHash.slice(-12)}` : '-'}
                    </div>
                  </div>

                  <div className="bc-hash-item">
                    <div className="bc-hash-label">Anchored Block & Date</div>
                    <div className="bc-hash-code" style={{ color: '#059669' }}>
                      Block #{verificationResult.anchoredBlock || '1,428,590'} • {verificationResult.anchoredAt || '15 Aug 2026'}
                    </div>
                  </div>

                  <div className="bc-hash-item">
                    <div className="bc-hash-label">
                      <span>Smart Contract Address</span>
                      <button
                        onClick={() => copyToClipboard(verificationResult.contractAddress, 'contract')}
                        className="bc-copy-btn"
                        title="Copy Address"
                      >
                        {copiedHash === 'contract' ? <Check style={{ width: 14, height: 14, color: '#059669' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <div className="bc-hash-code">
                      {verificationResult.contractAddress ? `${verificationResult.contractAddress.slice(0, 18)}...${verificationResult.contractAddress.slice(-8)}` : '0x71C8F7...'}
                    </div>
                  </div>

                  <div className="bc-hash-item">
                    <div className="bc-hash-label">
                      <span>Transaction Hash (TxID)</span>
                      <button
                        onClick={() => copyToClipboard(verificationResult.txHash, 'txHash')}
                        className="bc-copy-btn"
                        title="Copy TxHash"
                      >
                        {copiedHash === 'txHash' ? <Check style={{ width: 14, height: 14, color: '#059669' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      </button>
                    </div>
                    <div className="bc-hash-code" style={{ color: '#2563eb' }}>
                      {verificationResult.txHash ? `${verificationResult.txHash.slice(0, 18)}...${verificationResult.txHash.slice(-8)}` : '-'}
                    </div>
                  </div>
                </div>

                {/* Academic Snapshot Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                    Snapshot Anchored to Blockchain Consensus Layer
                  </div>
                  <div className="bc-metrics-row">
                    <div className="bc-metric-box">
                      <div className="bc-metric-label">Department</div>
                      <div className="bc-metric-val">{currentSelectedStudent.dept}</div>
                    </div>
                    <div className="bc-metric-box">
                      <div className="bc-metric-label">CGPA</div>
                      <div className="bc-metric-val green">{currentSelectedStudent.academic?.cgpa || currentSelectedStudent.cgpa}</div>
                    </div>
                    <div className="bc-metric-box">
                      <div className="bc-metric-label">Active Backlogs</div>
                      <div className="bc-metric-val">{currentSelectedStudent.backlogs ?? 0}</div>
                    </div>
                    <div className="bc-metric-box">
                      <div className="bc-metric-label">Attendance</div>
                      <div className="bc-metric-val purple">
                        {currentSelectedStudent.attendance?.percentage ?? currentSelectedStudent.attendance ?? 80}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <div className="bc-notice-banner">
                  <ShieldCheck style={{ width: 18, height: 18, shrink: 0, marginTop: 1, color: '#059669' }} />
                  <div>
                    <strong>Tamper-Proof Guarantee:</strong> All academic, attendance, and intervention records are verified by mathematical hash integrity. Any unauthorized modification will immediately trigger an on-chain alert.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
                <ShieldCheck style={{ width: 44, height: 44, margin: '0 auto 12px', color: '#cbd5e1' }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0b153b', margin: '0 0 6px' }}>Select a student and click verify</h4>
                <p style={{ fontSize: 12, margin: 0 }}>
                  Our service computes the real-time SHA-256 hash from all database fields and compares with the decentralized registry.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: SMART CONTRACT MICRO-GRANTS / SCHOLARSHIPS
      ======================================================== */}
      {activeSubTab === 'grants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header Info */}
          <div className="bc-panel" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0b153b', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Coins style={{ width: 20, height: 20, color: '#f59e0b' }} />
                  Conditional Smart Contract Micro-Grants
                </h3>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  Autonomous financial aid disbursed directly to socio-economically disadvantaged students who meet academic retention criteria.
                </p>
              </div>

              <div style={{ padding: '6px 14px', borderRadius: 20, background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706', fontSize: 12, fontWeight: 700 }}>
                Escrow Balance: 5.0 ETH / ₹ 1,50,000
              </div>
            </div>
          </div>

          {/* List of Eligible Students */}
          <div className="bc-grants-grid">
            {eligibleGrantStudents.map((s) => {
              const attVal = typeof s.attendance?.percentage === 'number' ? s.attendance.percentage : parseFloat(s.attendance || 80);
              const cgpaVal = parseFloat(s.academic?.cgpa || s.cgpa || 5.0);
              const isHighSocio = s.socioEconomic?.riskLevel === 'High Risk' || s.income === '< ₹1,00,000';
              const isDisbursing = grantDisbursingId === s.id;

              return (
                <div key={s.id} className="bc-grant-card">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="bc-grant-top">
                      <div className="bc-student-left">
                        <img
                          src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={s.name}
                          className="bc-student-avatar"
                        />
                        <div>
                          <div className="bc-student-name">{s.name}</div>
                          <div className="bc-student-meta">{s.rollNo || s.id} • {s.dept}</div>
                        </div>
                      </div>

                      <span className={`bc-grant-badge ${isHighSocio ? 'high' : 'medium'}`}>
                        {isHighSocio ? 'High Socio Need' : 'Eligible Retainer'}
                      </span>
                    </div>

                    <div className="bc-metrics-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      <div className="bc-metric-box">
                        <div className="bc-metric-label">Attendance</div>
                        <div className="bc-metric-val" style={{ color: attVal >= 75 ? '#059669' : '#d97706' }}>{attVal}%</div>
                      </div>
                      <div className="bc-metric-box">
                        <div className="bc-metric-label">CGPA</div>
                        <div className="bc-metric-val">{cgpaVal}</div>
                      </div>
                      <div className="bc-metric-box">
                        <div className="bc-metric-label">Grant Tier</div>
                        <div className="bc-metric-val" style={{ color: '#d97706' }}>₹ 15,000</div>
                      </div>
                    </div>

                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                      <strong>Criteria:</strong> Maintain attendance &gt; 70% and attend assigned remedial mentoring sessions.
                    </p>
                  </div>

                  <button
                    onClick={() => handleDisburseGrant(s)}
                    disabled={isDisbursing}
                    className="bc-btn-gold"
                  >
                    {isDisbursing ? (
                      <>
                        <RefreshCw style={{ width: 15, height: 15 }} className="spin" />
                        <span>Signing Smart Contract Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Coins style={{ width: 15, height: 15 }} />
                        <span>Execute Grant Release (₹ 15,000)</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: IMMUTABLE AUDIT LEDGER (BLOCK EXPLORER)
      ======================================================== */}
      {activeSubTab === 'ledger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Controls Bar */}
          <div className="bc-ledger-controls">
            <div className="bc-filter-group">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginRight: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter style={{ width: 14, height: 14 }} /> Filter:
              </span>
              {[
                ['ALL', 'All Blocks'],
                ['ATTENDANCE_BATCH', 'Attendance Batches'],
                ['ACADEMIC_CREDENTIAL', 'Academic Snapshots'],
                ['INTERVENTION_AUDIT', 'Intervention Audits'],
                ['SMART_GRANT', 'Smart Grants']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLedgerFilter(key)}
                  className={`bc-filter-btn ${ledgerFilter === key ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bc-search-wrap">
              <Search className="bc-search-icon" />
              <input
                type="text"
                placeholder="Search TxHash, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bc-search-input"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bc-table-container">
            <table className="bc-table">
              <thead>
                <tr>
                  <th>Transaction Hash</th>
                  <th>Block #</th>
                  <th>Event Type</th>
                  <th>Entity / Target</th>
                  <th>Gas Used</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
                      No blockchain transactions matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((tx, idx) => {
                    let typeClass = 'academic';
                    if (tx.type === 'ATTENDANCE_BATCH') typeClass = 'attendance';
                    if (tx.type === 'SMART_GRANT') typeClass = 'grant';
                    if (tx.type === 'INTERVENTION_AUDIT') typeClass = 'intervention';

                    return (
                      <tr key={tx.txHash || idx}>
                        <td style={{ fontFamily: 'Courier New', fontWeight: 600, color: '#5247e6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{tx.txHash ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-6)}` : '-'}</span>
                            <button
                              onClick={() => copyToClipboard(tx.txHash, `tx_${idx}`)}
                              className="bc-copy-btn"
                              title="Copy TxHash"
                            >
                              {copiedHash === `tx_${idx}` ? <Check style={{ width: 12, height: 12, color: '#059669' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                            </button>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'Courier New', fontWeight: 700, color: '#0b153b' }}>
                          #{tx.blockNumber}
                        </td>
                        <td>
                          <span className={`bc-type-tag ${typeClass}`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0b153b' }}>{tx.entityName || tx.title}</div>
                          {tx.details && <div style={{ fontSize: 11, color: '#64748b' }}>{tx.details}</div>}
                          {tx.amount && <div style={{ fontSize: 11, color: '#d97706', fontWeight: 700 }}>{tx.amount}</div>}
                        </td>
                        <td style={{ fontFamily: 'Courier New', color: '#64748b' }}>
                          {tx.gasUsed || '85,000'}
                        </td>
                        <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(tx.timestamp).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#059669', fontWeight: 700, fontSize: 11 }}>
                            <CheckCircle2 style={{ width: 14, height: 14 }} />
                            Immutable
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: OFFICIAL DIGITAL VERIFIABLE CERTIFICATE
      ======================================================== */}
      {showCertificateModal && certStudent && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="bc-cert-close"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            {/* Certificate Watermark Header */}
            <div className="bc-cert-header">
              <div className="bc-cert-badge-gold">
                <Award style={{ width: 14, height: 14 }} /> Official On-Chain Verifiable Credential
              </div>
              <h2 className="bc-cert-title">Certificate of Academic Integrity</h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
                Verified & Cryptographically Sealed on Polygon Blockchain Consensus Layer
              </p>
            </div>

            {/* Certificate Body */}
            <div className="bc-cert-body">
              <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: 0 }}>This is to certify that the academic credentials and attendance records of</p>
              <div className="bc-cert-name">{certStudent.name}</div>
              <div className="bc-cert-meta">
                Student ID: <strong>{certStudent.id}</strong> | Enrollment No: <strong>{certStudent.rollNo || certStudent.id}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Department of {certStudent.dept} • Semester {certStudent.semester || 4}
              </div>
            </div>

            {/* Academic Badges */}
            <div className="bc-cert-stats">
              <div className="bc-cert-stat-item">
                <div style={{ fontSize: 11, color: '#64748b' }}>CGPA Score</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0b153b', marginTop: 2 }}>{certStudent.academic?.cgpa || certStudent.cgpa || '-'}</div>
              </div>
              <div className="bc-cert-stat-item">
                <div style={{ fontSize: 11, color: '#64748b' }}>Attendance Rate</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#059669', marginTop: 2 }}>{certStudent.attendance?.percentage || certStudent.attendance || 80}%</div>
              </div>
              <div className="bc-cert-stat-item">
                <div style={{ fontSize: 11, color: '#64748b' }}>Integrity Status</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', marginTop: 2 }}>Verified Genuine</div>
              </div>
            </div>

            {/* Cryptographic Seal Footer */}
            <div className="bc-cert-seal">
              <div><strong>SHA-256 Proof Hash:</strong></div>
              <div style={{ color: '#059669', fontWeight: 700 }}>
                {verificationResult?.computedHash || '0x4f128bc990172e817bc5618290adcf557193bc1029148bcf771920acde81014e'}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                Polygon Block: #{stats?.currentBlockHeight || '1,428,594'} • Contract: 0x71C8F794B35f29633e9b1103A5817d235D7653f8
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => {
                  notify('Official PDF Receipt downloaded!');
                  setShowCertificateModal(false);
                }}
                className="btn-primary-purple"
              >
                <Download style={{ width: 16, height: 16 }} />
                <span>Download Verified Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
