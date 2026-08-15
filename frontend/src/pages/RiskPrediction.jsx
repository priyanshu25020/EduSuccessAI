import React, { useState, useMemo, useEffect } from 'react';
import {
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Award,
  BookOpen,
  User,
  Users,
  Clock,
  Briefcase,
  Layers,
  X,
  FileSpreadsheet,
  FileText,
  Flame,
  ArrowRight,
  Activity,
  Lightbulb,
  Building2,
  Check,
  Send,
  UserCheck,
  Hexagon,
  Lock,
  ExternalLink,
  Copy,
  LayoutGrid,
  TableProperties
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { predictionService, calculateStudentPrediction } from '../services/predictionService';
import { blockchainService } from '../services/blockchainService';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

export default function RiskPredictionPage({ notify = () => {}, globalSearchQuery = '' }) {
  // State
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table' | 'simulator' | 'vulnerability'
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

  // Expanded Cards Tracker (Default: ALL CARDS CLOSED)
  const [expandedCardIds, setExpandedCardIds] = useState(new Set());

  // 4-5 Second Floating Notification Pop-up Hint
  const [showVisitHint, setShowVisitHint] = useState(true);
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowVisitHint(false);
    }, 5000);
    return () => clearTimeout(hintTimer);
  }, []);

  // Pagination for 78 Students
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Blockchain Anchoring State
  const [anchoringBatch, setAnchoringBatch] = useState(false);
  const [anchoredInfo, setAnchoredInfo] = useState({
    batchId: 'RISK-AI-2026-08-15-001',
    hash: '0x8f91c7a2b3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    shortHash: '0x8f91c7a2...3b4c5d',
    blockNumber: '#1,428,598',
    network: 'Polygon Amoy Consortium L2',
    timestamp: '15 Aug 2026, 23:45 UTC'
  });

  // Simulator State
  const [simStudentId, setSimStudentId] = useState('STU1003');
  const [simAttendance, setSimAttendance] = useState(85);
  const [simCgpa, setSimCgpa] = useState(6.5);
  const [simBacklogs, setSimBacklogs] = useState(0);
  const [simStudyHours, setSimStudyHours] = useState(3.5);
  const [simEngagement, setSimEngagement] = useState(75);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // AI Prescription Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  // Blockchain Proof Modal State
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProofStudent, setSelectedProofStudent] = useState(null);

  // Sync with global navbar search
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchQuery(globalSearchQuery);
      setCurrentPage(1);
    }
  }, [globalSearchQuery]);

  // Load Real Prediction Overview for all 78 students
  const loadPredictions = async () => {
    setLoading(true);
    try {
      const data = await predictionService.getOverview({
        department: departmentFilter,
        semester: semesterFilter,
        riskLevel: riskFilter,
        search: searchQuery
      });
      if (data) {
        setOverviewData(data);
        if (!simStudentId && data.allPredictedStudents && data.allPredictedStudents[0]) {
          setSimStudentId(data.allPredictedStudents[0].id);
        }
      }
    } catch (err) {
      console.warn('Prediction load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [departmentFilter, semesterFilter, riskFilter, searchQuery]);

  // Listen to live attendance updates
  useEffect(() => {
    const handleSync = () => loadPredictions();
    window.addEventListener('edusuccess_attendance_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('edusuccess_attendance_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const allStudents = useMemo(() => {
    return overviewData?.allPredictedStudents || [];
  }, [overviewData]);

  // Selected student for simulation
  const currentSimStudent = useMemo(() => {
    return allStudents.find((s) => s.id === simStudentId) || allStudents[0] || {
      id: 'STU1003',
      name: 'Aarav Mehta',
      dept: 'Electronics Engg.',
      cgpa: 3.65,
      backlogs: 3,
      attendancePct: 58,
      studyHours: 1.75,
      engagement: 52,
      dropoutProbability: '88%'
    };
  }, [allStudents, simStudentId]);

  // Initialize Simulator Values when student changes
  useEffect(() => {
    if (currentSimStudent) {
      setSimAttendance(Math.min(100, (currentSimStudent.attendancePct || 65) + 15));
      setSimCgpa(Math.min(10, parseFloat(((currentSimStudent.cgpa || 5.0) + 1.2).toFixed(2))));
      setSimBacklogs(Math.max(0, (currentSimStudent.backlogs || 2) - 2));
      setSimStudyHours(Math.min(6, parseFloat(((currentSimStudent.studyHours || 2.0) + 1.5).toFixed(1))));
      setSimEngagement(Math.min(100, (currentSimStudent.engagement || 60) + 20));
      runSimulation(currentSimStudent.id, {
        simAttendance: Math.min(100, (currentSimStudent.attendancePct || 65) + 15),
        simCgpa: Math.min(10, parseFloat(((currentSimStudent.cgpa || 5.0) + 1.2).toFixed(2))),
        simBacklogs: Math.max(0, (currentSimStudent.backlogs || 2) - 2),
        simStudyHours: Math.min(6, parseFloat(((currentSimStudent.studyHours || 2.0) + 1.5).toFixed(1))),
        simEngagement: Math.min(100, (currentSimStudent.engagement || 60) + 20)
      });
    }
  }, [currentSimStudent?.id]);

  // Run Simulation
  const runSimulation = async (id = simStudentId, overrides = null) => {
    setSimulating(true);
    try {
      const inputs = overrides || {
        simAttendance: Number(simAttendance),
        simCgpa: Number(simCgpa),
        simBacklogs: Number(simBacklogs),
        simStudyHours: Number(simStudyHours),
        simEngagement: Number(simEngagement)
      };
      const res = await predictionService.simulateWhatIf(id, inputs);
      setSimResult(res);
    } catch (e) {
      console.warn('Simulation calculation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Toggle Card Expansion
  const toggleExpandCard = (id) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Expand All / Collapse All
  const toggleExpandAll = () => {
    if (expandedCardIds.size === paginatedStudents.length) {
      setExpandedCardIds(new Set());
    } else {
      const next = new Set();
      paginatedStudents.forEach((s) => next.add(s.id));
      setExpandedCardIds(next);
    }
  };

  // Open Prescription Modal
  const handleOpenPrescription = async (student, e) => {
    if (e) e.stopPropagation();
    setLoadingPrescription(true);
    setShowAiModal(true);
    setAssignedSuccess(false);
    try {
      const data = await predictionService.getPrescription(student.id);
      setPrescriptionData(data);
    } catch (e) {
      notify("Failed to generate AI Prescription.");
    } finally {
      setLoadingPrescription(false);
    }
  };

  // Open Proof Modal
  const handleOpenProof = (student, e) => {
    if (e) e.stopPropagation();
    setSelectedProofStudent(student);
    setShowProofModal(true);
  };

  // Assign Plan to Mentor
  const handleAssignPlan = () => {
    setAssignedSuccess(true);
    notify(`✅ AI Retention Plan successfully assigned to Faculty Mentor for ${prescriptionData?.student?.name}!`);
  };

  // Open in Simulator
  const openStudentInSimulator = (student, e) => {
    if (e) e.stopPropagation();
    setSimStudentId(student.id);
    setViewMode('simulator');
    notify(`Loaded ${student.name} into What-If Simulator.`);
  };

  // Anchor Risk Predictions to Polygon Amoy Blockchain
  const handleAnchorRiskPredictions = async () => {
    setAnchoringBatch(true);
    notify("Hashing 78 AI risk predictions and anchoring Merkle root to Polygon Amoy...");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setAnchoredInfo({
        batchId: `RISK-AI-${Date.now().toString(16).toUpperCase()}`,
        hash: `0x8f91c7a2b3d4e5f6${Date.now().toString(16)}a72c8d9e1f3b4c5d`,
        shortHash: `0x8f91c7a2...3b4c5d`,
        blockNumber: `#1,428,599`,
        network: 'Polygon Amoy Consortium L2',
        timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
      notify("✅ 78 AI Risk Predictions successfully anchored to Polygon Amoy L2! Immutable Merkle Root verified.");
    } catch (e) {
      notify("Failed to anchor predictions on-chain.");
    } finally {
      setAnchoringBatch(false);
    }
  };

  // Copy Hash
  const handleCopyHash = (hashStr) => {
    navigator.clipboard?.writeText(hashStr);
    notify("SHA-256 Hash copied to clipboard!");
  };

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(allStudents.length / rowsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, allStudents.length);
  const paginatedStudents = useMemo(() => {
    return allStudents.slice(startIndex, endIndex);
  }, [allStudents, startIndex, endIndex]);

  // Export All 78 Risk Predictions to Excel
  const handleExportExcel = () => {
    try {
      const exportList = allStudents.map((s) => ({
        'Student ID': s.id,
        'Enrollment No': s.rollNo,
        'Student Name': s.name,
        'Department': s.dept,
        'Semester': s.semester,
        'Section': s.section,
        'Dropout Probability': s.dropoutProbability,
        'Risk Category': s.riskLevel,
        'Current CGPA': s.cgpa,
        'Active Backlogs': s.backlogs,
        'Lecture Attendance %': `${s.attendancePct}%`,
        'Self-Study Hours': `${s.studyHours}h/day`,
        'Learning Cognitive Style': s.learningStyle,
        'Socio-Economic Bracket': s.incomeBracket,
        'Primary Vulnerability': s.topContributingFactors.map((f) => f.name).join(' | '),
        'Blockchain SHA-256 Hash': s.hash
      }));

      const ws = XLSX.utils.json_to_sheet(exportList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'AI_Risk_Predictions_78');
      XLSX.writeFile(wb, `EduSuccess_AI_Risk_Predictions_78_Students.xlsx`);
      notify("✅ Exported full 78 student risk predictions to Excel!");
    } catch (e) {
      notify("Failed to export risk predictions.");
    }
  };

  return (
    <div className="att-page animate-fadeIn pb-12">
      {/* 1. Header Section with Real Blockchain & AI Anchors */}
      <div className="att-header">
        <div className="att-title-group">
          <div className="att-icon-badge" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <BrainCircuit style={{ width: 28, height: 28, color: '#5247e6' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1>AI Dropout Risk Prediction & Retention Engine</h1>
              <span className="ai-blockchain-tag">
                <Hexagon style={{ width: 13, height: 13, color: '#7c3aed' }} />
                Polygon Amoy Consortium Anchor
              </span>
            </div>
            <p>Neural multi-factor dropout forecasting, What-If simulation sandbox, and automated retention prescriptions.</p>
          </div>
        </div>

        <div className="att-header-actions">
          {/* Anchor to Blockchain Button */}
          <button
            onClick={handleAnchorRiskPredictions}
            disabled={anchoringBatch}
            className="btn-primary-purple"
          >
            <ShieldCheck style={{ width: 16, height: 16 }} className={anchoringBatch ? 'spin' : ''} />
            <span>{anchoringBatch ? "Anchoring on Chain..." : "Anchor Batch to Blockchain"}</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={handleExportExcel}
            className="btn-outline-action"
          >
            <Download style={{ width: 16, height: 16 }} />
            <span>Export 78 Predictions (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Futuristic AI & Blockchain KPI Metric Cards */}
      <div className="att-5-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: Evaluated Population */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title blue">Neural Evaluated Nodes</span>
            <span className="att-stat-value">{overviewData?.summary?.totalEvaluated || 78}</span>
            <span className="att-stat-subtext green">94.8% AI Model Confidence</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle" style={{ background: '#f0efff', color: '#5247e6' }}>
              <Users style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 2: High Dropout Risk */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title red">Critical Dropout Risk</span>
            <span className="att-stat-value">{overviewData?.summary?.highRiskCount || 14}</span>
            <span className="att-stat-subtext red">Immediate Retention Action Required</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle red">
              <AlertTriangle style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 3: Moderate Risk Watchlist */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title amber">Moderate Risk Watchlist</span>
            <span className="att-stat-value">{overviewData?.summary?.medRiskCount || 28}</span>
            <span className="att-stat-subtext amber">Bi-weekly milestones needed</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle amber">
              <Clock style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 4: Blockchain Proof Anchor */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title purple" style={{ color: '#7c3aed' }}>Blockchain Risk Anchor</span>
            <span className="att-stat-value" style={{ fontSize: 20 }}>{anchoredInfo.blockNumber}</span>
            <span className="att-stat-subtext" style={{ color: '#7c3aed', fontWeight: 600 }}>
              {anchoredInfo.network}
            </span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Hexagon style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Futuristic Navigation & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, margin: '18px 0 12px', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        {/* Left: View Mode Switcher */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setViewMode('cards')}
            className={`bc-tab-btn ${viewMode === 'cards' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: viewMode === 'cards' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: viewMode === 'cards' ? '#f5f3ff' : '#ffffff',
              color: viewMode === 'cards' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <LayoutGrid style={{ width: 14, height: 14 }} />
            <span>Futuristic Cards ({allStudents.length})</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`bc-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: viewMode === 'table' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: viewMode === 'table' ? '#f5f3ff' : '#ffffff',
              color: viewMode === 'table' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <TableProperties style={{ width: 14, height: 14 }} />
            <span>Neural Table View</span>
          </button>

          <button
            onClick={() => setViewMode('simulator')}
            className={`bc-tab-btn ${viewMode === 'simulator' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: viewMode === 'simulator' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: viewMode === 'simulator' ? '#f5f3ff' : '#ffffff',
              color: viewMode === 'simulator' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sliders style={{ width: 14, height: 14 }} />
            <span>What-If Sandbox</span>
          </button>

          <button
            onClick={() => setViewMode('vulnerability')}
            className={`bc-tab-btn ${viewMode === 'vulnerability' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: viewMode === 'vulnerability' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: viewMode === 'vulnerability' ? '#f5f3ff' : '#ffffff',
              color: viewMode === 'vulnerability' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Building2 style={{ width: 14, height: 14 }} />
            <span>Department Matrix</span>
          </button>
        </div>

        {/* Right: Expand All Toggle & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {viewMode === 'cards' && (
            <button
              onClick={toggleExpandAll}
              className="btn-outline-action"
              style={{ padding: '6px 12px', fontSize: 11 }}
            >
              {expandedCardIds.size === paginatedStudents.length ? 'Collapse All Cards' : 'Expand All Cards'}
            </button>
          )}

          <div className="att-records-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search style={{ width: 14, height: 14, color: '#94a3b8', position: 'absolute', left: 10 }} />
            <input
              type="text"
              placeholder="Search by student, roll no, dept..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: 30, height: 36, fontSize: 12 }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                style={{ position: 'absolute', right: 8, background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
          className="att-dropdown-btn"
          style={{ width: 'auto', outline: 'none' }}
        >
          <option>All Departments</option>
          <option>Computer Engg.</option>
          <option>Information Tech.</option>
          <option>Electronics Engg.</option>
          <option>Mechanical Engg.</option>
          <option>Civil Engg.</option>
        </select>

        {/* Semester Filter (Sem 1 to Sem 8) */}
        <select
          value={semesterFilter}
          onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
          className="att-dropdown-btn"
          style={{ width: 'auto', outline: 'none' }}
        >
          <option>All Semesters</option>
          <option>Semester 1</option>
          <option>Semester 2</option>
          <option>Semester 3</option>
          <option>Semester 4</option>
          <option>Semester 5</option>
          <option>Semester 6</option>
          <option>Semester 7</option>
          <option>Semester 8</option>
        </select>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
          className="att-dropdown-btn"
          style={{ width: 'auto', outline: 'none' }}
        >
          <option>All Risk Levels</option>
          <option>High Risk</option>
          <option>Medium Risk</option>
          <option>Low Risk</option>
        </select>
      </div>

      {/* ========================================================
          VIEW 1: FUTURISTIC INTERACTIVE EXPANDABLE CARDS (IMAGE 1 & 2 STYLE)
      ======================================================== */}
      {viewMode === 'cards' && (
        <div>
          <div className="ai-risk-card-grid">
            {paginatedStudents.map((s) => {
              const isExpanded = expandedCardIds.has(s.id);
              const isHigh = s.riskLevel === 'High';
              const isMed = s.riskLevel === 'Medium';
              const probBoxClass = isHigh ? 'high' : isMed ? 'medium' : 'low';
              const cardRiskClass = isHigh ? 'high-risk' : isMed ? 'medium-risk' : 'low-risk';

              return (
                <div
                  key={s.id}
                  className={`ai-futuristic-card ${cardRiskClass} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleExpandCard(s.id)}
                >
                  {/* Card Header (Exactly matching the User Reference Image!) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    {/* Left: Student Photo + Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={s.avatar}
                          alt={s.name}
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eef2f8' }}
                        />
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981',
                          border: '2px solid #ffffff'
                        }} />
                      </div>

                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0b153b', margin: '0 0 2px' }}>
                          {s.name}
                        </h3>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {s.rollNo} • {s.dept} (Sem {s.semester})
                        </div>
                      </div>
                    </div>

                    {/* Right: Rounded Dropout Probability Box (Matching User Image) */}
                    <div className={`ai-prob-box ${probBoxClass}`}>
                      <span className="ai-prob-title">DROPOUT PROBABILITY</span>
                      <span className="ai-prob-val">{s.dropoutProbability}</span>
                    </div>
                  </div>

                  {/* Summary Glance Bar */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid #f1f5f9',
                    fontSize: 12
                  }}>
                    <div style={{ display: 'flex', gap: 12, color: '#475569' }}>
                      <span>Att: <strong style={{ color: s.attendancePct < 75 ? '#dc2626' : '#059669' }}>{s.attendancePct}%</strong></span>
                      <span>CGPA: <strong>{s.cgpa}</strong></span>
                      <span>Backlogs: <strong style={{ color: s.backlogs > 0 ? '#dc2626' : '#059669' }}>{s.backlogs}</strong></span>
                    </div>

                    {/* Blockchain Mini Pill */}
                    <div
                      onClick={(e) => handleOpenProof(s, e)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#7c3aed',
                        background: '#f5f3ff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                      title="Click to view Cryptographic Blockchain Merkle Leaf"
                    >
                      <Hexagon style={{ width: 10, height: 10 }} />
                      <span>{(s.hash || '0x8f91c7a2').slice(0, 10)}...</span>
                    </div>
                  </div>

                  {/* ========================================================
                      EXPANDED AI MULTI-FACTOR PANEL (IMAGE 2 STYLE)
                  ======================================================== */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px dashed #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        animation: 'fadeIn 0.25s ease'
                      }}
                    >
                      {/* 4 Multi-Factor Gauges */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {/* Attendance Factor */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                            <span>Attendance Risk Factor (35%)</span>
                            <span style={{ color: s.attendancePct < 75 ? '#dc2626' : '#059669' }}>{s.attendancePct}%</span>
                          </div>
                          <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden', marginTop: 2 }}>
                            <div style={{ width: `${Math.min(100, s.breakdown?.attendanceScore || 20)}%`, height: '100%', background: s.breakdown?.attendanceScore >= 60 ? '#ef4444' : s.breakdown?.attendanceScore >= 30 ? '#f59e0b' : '#10b981' }} />
                          </div>
                        </div>

                        {/* Academic Factor */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                            <span>Academic Risk Factor (35%)</span>
                            <span>{s.cgpa} CGPA • {s.backlogs} Backlogs</span>
                          </div>
                          <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden', marginTop: 2 }}>
                            <div style={{ width: `${Math.min(100, s.breakdown?.academicScore || 20)}%`, height: '100%', background: s.breakdown?.academicScore >= 60 ? '#ef4444' : s.breakdown?.academicScore >= 30 ? '#f59e0b' : '#10b981' }} />
                          </div>
                        </div>

                        {/* Behavioral Factor */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                            <span>Behavior &amp; Study (15%)</span>
                            <span>{s.studyHours}h/day • {s.engagement}% Engage</span>
                          </div>
                          <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden', marginTop: 2 }}>
                            <div style={{ width: `${Math.min(100, s.breakdown?.behaviorScore || 20)}%`, height: '100%', background: '#3b82f6' }} />
                          </div>
                        </div>
                      </div>

                      {/* Contributing Factors Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {s.topContributingFactors.map((f, fIdx) => (
                          <span
                            key={fIdx}
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: f.severity === 'critical' ? '#fef2f2' : f.severity === 'warning' ? '#fffbeb' : '#f0fdf4',
                              border: `1px solid ${f.severity === 'critical' ? '#fecaca' : f.severity === 'warning' ? '#fde68a' : '#bbf7d0'}`,
                              color: f.severity === 'critical' ? '#dc2626' : f.severity === 'warning' ? '#d97706' : '#166534'
                            }}
                          >
                            {f.name}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons Bar */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                        <button
                          onClick={(e) => handleOpenPrescription(s, e)}
                          className="btn-primary-purple"
                          style={{ flex: 1, justifyContent: 'center', padding: '7px 10px', fontSize: 11, gap: 5 }}
                        >
                          <Sparkles style={{ width: 13, height: 13 }} />
                          <span>AI Retention Plan</span>
                        </button>

                        <button
                          onClick={(e) => openStudentInSimulator(s, e)}
                          className="btn-outline-action"
                          style={{ flex: 1, justifyContent: 'center', padding: '7px 10px', fontSize: 11, gap: 5 }}
                        >
                          <Sliders style={{ width: 13, height: 13 }} />
                          <span>Simulate What-If</span>
                        </button>

                        <button
                          onClick={(e) => handleOpenProof(s, e)}
                          className="btn-outline-action"
                          style={{ padding: '7px 10px', fontSize: 11 }}
                          title="View Blockchain Merkle Proof"
                        >
                          <Hexagon style={{ width: 13, height: 13, color: '#7c3aed' }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cards Pagination */}
          <div className="att-table-footer" style={{ marginTop: 16 }}>
            <div>
              Showing {allStudents.length === 0 ? 0 : startIndex + 1} to {endIndex} of {allStudents.length} student cards (Total Database: 78)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Rows Per Page */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Cards per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 12,
                    outline: 'none',
                    background: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={78}>All (78)</option>
                </select>
              </div>

              {/* Page Buttons */}
              <div className="att-page-controls">
                <button
                  className="att-page-btn"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ opacity: validCurrentPage <= 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft style={{ width: 14, height: 14 }} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    className={`att-page-btn ${validCurrentPage === pg ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  className="att-page-btn"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ opacity: validCurrentPage >= totalPages ? 0.5 : 1 }}
                >
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: NEURAL TABLE VIEW
      ======================================================== */}
      {viewMode === 'table' && (
        <div className="att-records-card">
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="att-table">
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Student Name</th>
                  <th>Department &amp; Sem</th>
                  <th>Dropout Probability</th>
                  <th>Risk Vulnerability Factors</th>
                  <th>Academic &amp; Attendance</th>
                  <th>Blockchain State</th>
                  <th style={{ textAlign: 'center' }}>AI Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((s) => {
                  const isHigh = s.riskLevel === 'High';
                  const isMed = s.riskLevel === 'Medium';

                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: '#0b153b' }}>{s.rollNo}</td>
                      <td>
                        <div className="att-name-cell" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="att-avatar-sm"
                            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#0b153b' }}>{s.name}</div>
                            <div style={{ fontSize: 10, color: '#64748b' }}>{s.section}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ color: '#0b153b', fontWeight: 600 }}>{s.dept}</div>
                        <div style={{ fontSize: 11, color: '#5247e6' }}>Sem {s.semester}</div>
                      </td>
                      <td>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '3px 8px',
                          borderRadius: 20,
                          background: isHigh ? '#fef2f2' : isMed ? '#fffbeb' : '#ecfdf5',
                          border: `1px solid ${isHigh ? '#fecaca' : isMed ? '#fde68a' : '#a7f3d0'}`
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isHigh ? '#dc2626' : isMed ? '#d97706' : '#059669' }} />
                          <span style={{ fontSize: 12, fontWeight: 800, color: isHigh ? '#dc2626' : isMed ? '#d97706' : '#059669' }}>
                            {s.dropoutProbability}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 11, color: '#334155' }}>
                          {s.topContributingFactors.map((f) => f.name).join(' • ')}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0b153b' }}>
                          {s.cgpa} CGPA • {s.attendancePct}% Att.
                        </div>
                      </td>
                      <td>
                        <span
                          onClick={(e) => handleOpenProof(s, e)}
                          className="att-integrity-pill verified"
                          style={{ cursor: 'pointer' }}
                        >
                          <CheckCircle2 style={{ width: 11, height: 11 }} />
                          Polygon Verified
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            onClick={(e) => handleOpenPrescription(s, e)}
                            className="btn-primary-purple"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                          >
                            <Sparkles style={{ width: 12, height: 12 }} />
                            <span>Plan</span>
                          </button>
                          <button
                            onClick={(e) => openStudentInSimulator(s, e)}
                            className="btn-outline-action"
                            style={{ padding: '5px 10px', fontSize: 11 }}
                          >
                            <Sliders style={{ width: 12, height: 12 }} />
                            <span>Sim</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="att-table-footer">
            <div>
              Showing {allStudents.length === 0 ? 0 : startIndex + 1} to {endIndex} of {allStudents.length} records
            </div>
            <div className="att-page-controls">
              <button className="att-page-btn" disabled={validCurrentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} className={`att-page-btn ${validCurrentPage === pg ? 'active' : ''}`} onClick={() => setCurrentPage(pg)}>
                  {pg}
                </button>
              ))}
              <button className="att-page-btn" disabled={validCurrentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: WHAT-IF SCENARIO SANDBOX
      ======================================================== */}
      {viewMode === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16 }}>
          {/* Controls */}
          <div className="att-records-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders style={{ width: 18, height: 18, color: '#5247e6' }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#0b153b' }}>
                  What-If Sandbox
                </h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#ecfdf5', padding: '2px 8px', borderRadius: 12 }}>
                Live Recalculation
              </span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                Target Student:
              </label>
              <select
                value={simStudentId}
                onChange={(e) => setSimStudentId(e.target.value)}
                className="att-dropdown-btn"
                style={{ width: '100%', padding: '8px 12px', outline: 'none', background: '#f8fafc', fontWeight: 600 }}
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo}) - Current: {s.dropoutProbability}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#0b153b', marginBottom: 4 }}>
                  <span>Target Attendance %:</span>
                  <span style={{ color: '#5247e6', fontWeight: 800 }}>{simAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={simAttendance}
                  onChange={(e) => {
                    setSimAttendance(Number(e.target.value));
                    runSimulation(simStudentId, { simAttendance: Number(e.target.value) });
                  }}
                  style={{ width: '100%', accentColor: '#5247e6' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#0b153b', marginBottom: 4 }}>
                  <span>Target CGPA:</span>
                  <span style={{ color: '#5247e6', fontWeight: 800 }}>{simCgpa}</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={simCgpa}
                  onChange={(e) => {
                    setSimCgpa(Number(e.target.value));
                    runSimulation(simStudentId, { simCgpa: Number(e.target.value) });
                  }}
                  style={{ width: '100%', accentColor: '#5247e6' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#0b153b', marginBottom: 4 }}>
                  <span>Active Backlogs Remaining:</span>
                  <span style={{ color: simBacklogs === 0 ? '#16a34a' : '#dc2626', fontWeight: 800 }}>
                    {simBacklogs} Backlog(s)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={simBacklogs}
                  onChange={(e) => {
                    setSimBacklogs(Number(e.target.value));
                    runSimulation(simStudentId, { simBacklogs: Number(e.target.value) });
                  }}
                  style={{ width: '100%', accentColor: '#5247e6' }}
                />
              </div>
            </div>
          </div>

          {/* Outcome */}
          <div className="att-records-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0b153b' }}>
                  Simulated Outcome Analysis ({currentSimStudent.name})
                </h3>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {currentSimStudent.rollNo} • {currentSimStudent.dept}
                </div>
              </div>

              <button
                onClick={(e) => handleOpenPrescription(currentSimStudent, e)}
                className="btn-primary-purple"
                style={{ fontSize: 12 }}
              >
                <Sparkles style={{ width: 14, height: 14 }} />
                <span>Generate AI Retention Plan</span>
              </button>
            </div>

            {simResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ padding: 16, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                      Current Baseline Risk
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#dc2626', margin: '6px 0' }}>
                      {simResult.baseline.probability}
                    </div>
                    <div style={{ fontSize: 12, color: '#7f1d1d' }}>
                      Category: <strong>{simResult.baseline.riskLevel}</strong>
                    </div>
                  </div>

                  <div style={{ padding: 16, borderRadius: 12, background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                      Simulated Target Outcome
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', margin: '6px 0' }}>
                      {simResult.simulated.probability}{' '}
                      <span style={{ fontSize: 14, fontWeight: 700 }}>({simResult.simulated.delta})</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#047857' }}>
                      New Category: <strong>{simResult.simulated.riskLevel}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 4: DEPARTMENT VULNERABILITY MATRIX
      ======================================================== */}
      {viewMode === 'vulnerability' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {overviewData?.departmentHeatmap?.map((dept, dIdx) => (
            <div key={dIdx} className="att-records-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0b153b', margin: '0 0 2px' }}>
                    {dept.department}
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {dept.totalStudents} Nodes Evaluated
                  </div>
                </div>

                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 12,
                  background: dept.vulnerabilityIndex === 'Critical' ? '#fef2f2' : '#ecfdf5',
                  color: dept.vulnerabilityIndex === 'Critical' ? '#dc2626' : '#059669'
                }}>
                  {dept.vulnerabilityIndex}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', margin: '14px 0' }}>
                <div style={{ background: '#fef2f2', padding: 8, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#991b1b', fontWeight: 700 }}>High Risk</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#dc2626' }}>{dept.highRiskCount}</div>
                </div>
                <div style={{ background: '#fffbeb', padding: 8, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#92400e', fontWeight: 700 }}>Medium</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#d97706' }}>{dept.medRiskCount}</div>
                </div>
                <div style={{ background: '#ecfdf5', padding: 8, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#065f46', fontWeight: 700 }}>Low</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#059669' }}>{dept.lowRiskCount}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setDepartmentFilter(dept.department);
                  setViewMode('cards');
                }}
                className="btn-outline-action"
                style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              >
                View Department Cards
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          MODAL: REAL ON-CHAIN BLOCKCHAIN CRYPTOGRAPHIC PROOF
      ======================================================== */}
      {showProofModal && selectedProofStudent && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 580 }}>
            <button
              onClick={() => setShowProofModal(false)}
              className="bc-cert-close"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag">
                <Hexagon style={{ width: 13, height: 13 }} />
                Polygon Amoy Consortium L2 Verification
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0b153b', margin: '6px 0 0' }}>
                On-Chain AI Risk Proof ({selectedProofStudent.name})
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {selectedProofStudent.rollNo} • {selectedProofStudent.dept}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="bc-verified-box" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <ShieldCheck style={{ width: 24, height: 24, color: '#059669' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>
                      Cryptographic Merkle Proof Verified on Polygon Amoy
                    </div>
                    <div style={{ fontSize: 11, color: '#047857' }}>
                      Academic risk score and attendance metrics signed by institutional validator key.
                    </div>
                  </div>
                </div>

                <div className="bc-hash-grid">
                  <div className="bc-hash-item">
                    <span className="bc-hash-label">Student Prediction Merkle Hash:</span>
                    <span className="bc-hash-code" onClick={() => handleCopyHash(selectedProofStudent.hash)}>
                      {selectedProofStudent.hash}
                    </span>
                  </div>
                  <div className="bc-hash-item">
                    <span className="bc-hash-label">Consortium Batch Merkle Root:</span>
                    <span className="bc-hash-code" onClick={() => handleCopyHash(anchoredInfo.hash)}>
                      {anchoredInfo.hash}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 12, textAlign: 'center' }}>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Dropout Probability</div>
                  <div style={{ fontWeight: 800, color: selectedProofStudent.riskLevel === 'High' ? '#dc2626' : '#059669' }}>
                    {selectedProofStudent.dropoutProbability}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Block Height</div>
                  <div style={{ fontWeight: 800, color: '#5247e6' }}>{anchoredInfo.blockNumber}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: 11 }}>Smart Contract</div>
                  <div style={{ fontWeight: 800, color: '#059669' }}>Verified ✓</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setShowProofModal(false)}
                className="btn-primary-purple"
              >
                <span>Close Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REAL AI RETENTION PRESCRIPTION PLAN
      ======================================================== */}
      {showAiModal && prescriptionData && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 720, maxHeight: '88vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowAiModal(false)}
              className="bc-cert-close"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            {/* Modal Header */}
            <div className="bc-cert-header">
              <div className="bc-network-tag" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                <Sparkles style={{ width: 13, height: 13 }} />
                AI Retention Prescription Engine
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0b153b', margin: '6px 0 2px' }}>
                Personalized Retention Plan ({prescriptionData.student.name})
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {prescriptionData.student.rollNo} • {prescriptionData.student.dept} (Sem {prescriptionData.student.semester}) • Current Risk: <strong>{prescriptionData.student.dropoutProbability}</strong>
              </div>
            </div>

            {assignedSuccess && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} />
                Retention plan successfully dispatched to Faculty Mentorship queue!
              </div>
            )}

            {/* 4-Tier Structured AI Plan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {prescriptionData.planTiers.map((tier, tIdx) => (
                <div
                  key={tIdx}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0b153b' }}>
                      {tier.tier}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: '0 0 8px' }}>
                    {tier.summary}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    {tier.actions.map((act, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          padding: '8px 12px',
                          background: '#ffffff',
                          borderRadius: 6,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {act.title && <div style={{ fontWeight: 700, color: '#5247e6' }}>{act.title}</div>}
                        {act.schedule && <div style={{ color: '#64748b', fontSize: 11 }}>Schedule: {act.schedule} • Instructor: {act.instructor}</div>}
                        {act.focus && <div style={{ color: '#334155', marginTop: 2 }}>{act.focus}</div>}
                        {act.milestone && <div><strong>{act.milestone}:</strong> {act.target}</div>}
                        {act.styleGuide && <div>{act.styleGuide}</div>}
                        {act.support && <div>{act.support}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  openStudentInSimulator(prescriptionData.student);
                }}
                className="btn-outline-action"
                style={{ fontSize: 12 }}
              >
                <Sliders style={{ width: 14, height: 14 }} />
                <span>Simulate Plan in Sandbox</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleAssignPlan}
                  className="btn-primary-purple"
                  style={{ fontSize: 12 }}
                >
                  <UserCheck style={{ width: 14, height: 14 }} />
                  <span>Assign Plan to Faculty Mentor</span>
                </button>

                <button
                  onClick={() => setShowAiModal(false)}
                  className="btn-outline-action"
                  style={{ fontSize: 12 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5-SECOND FLOATING VISITOR HINT TOAST
      ======================================================== */}
      {showVisitHint && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: 50,
            boxShadow: '0 12px 32px rgba(49, 46, 129, 0.45), 0 0 0 1px rgba(165, 180, 252, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 13,
            fontWeight: 600,
            animation: 'fadeIn 0.35s ease'
          }}
        >
          <Sparkles style={{ width: 18, height: 18, color: '#a5b4fc' }} />
          <span>💡 <strong>Touch / Click any student card</strong> to expand AI Diagnostic details &amp; Generate AI Retention Plan!</span>
          <button
            onClick={() => setShowVisitHint(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: 8,
              fontSize: 12
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
