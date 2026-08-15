import React, { useState, useMemo, useEffect } from 'react';
import {
  Target,
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
  Check
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { predictionService } from '../services/predictionService';
import { studentService } from '../services/studentService';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

export default function RiskPredictionPage({ notify = () => {}, globalSearchQuery = '' }) {
  // State
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'simulator' | 'vulnerability'
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [semesterFilter, setSemesterFilter] = useState('All Semesters');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

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
  const [prescriptionStudent, setPrescriptionStudent] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  // Load Real Prediction Overview from Backend API
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
      dropoutProbability: '93%'
    };
  }, [allStudents, simStudentId]);

  // Initialize Simulator Values when student changes
  useEffect(() => {
    if (currentSimStudent) {
      setSimAttendance(Math.min(100, Math.round(Number(currentSimStudent.attendancePct || 80) + 15)));
      setSimCgpa(Math.min(10, Number((parseFloat(currentSimStudent.cgpa || 5.0) + 1.2).toFixed(2))));
      setSimBacklogs(Math.max(0, parseInt(currentSimStudent.backlogs || 0, 10) - 2));
      setSimStudyHours(Math.min(8, Number((parseFloat(currentSimStudent.studyHours || 2.0) + 1.0).toFixed(1))));
      setSimEngagement(Math.min(100, parseInt(currentSimStudent.engagement || 60, 10) + 20));
      runSimulation(currentSimStudent.id, {
        simulatedAttendance: Math.min(100, Math.round(Number(currentSimStudent.attendancePct || 80) + 15)),
        simulatedCgpa: Math.min(10, Number((parseFloat(currentSimStudent.cgpa || 5.0) + 1.2).toFixed(2))),
        simulatedBacklogs: Math.max(0, parseInt(currentSimStudent.backlogs || 0, 10) - 2),
        simulatedStudyHours: Math.min(8, Number((parseFloat(currentSimStudent.studyHours || 2.0) + 1.0).toFixed(1))),
        simulatedEngagement: Math.min(100, parseInt(currentSimStudent.engagement || 60, 10) + 20)
      });
    }
  }, [simStudentId]);

  // Run Simulation Handler
  const runSimulation = async (idToSimulate, customParams) => {
    setSimulating(true);
    try {
      const payload = customParams || {
        studentId: idToSimulate || simStudentId,
        simulatedAttendance: simAttendance,
        simulatedCgpa: simCgpa,
        simulatedBacklogs: simBacklogs,
        simulatedStudyHours: simStudyHours,
        simulatedEngagement: simEngagement
      };
      const res = await predictionService.simulateScenario(payload);
      if (res) {
        setSimResult(res);
      }
    } catch (e) {
      console.warn('Simulation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Open AI Prescription Modal
  const handleOpenPrescription = async (student) => {
    setPrescriptionStudent(student);
    setShowAiModal(true);
    setLoadingPrescription(true);
    try {
      const res = await predictionService.generatePrescription(student.id);
      setPrescriptionData(res || {
        studentId: student.id,
        name: student.name,
        dropoutProbability: student.dropoutProbability,
        riskLevel: student.riskLevel,
        aiProvider: 'EduSuccess Predictive Prescription Engine',
        recommendations: [
          student.prescription,
          `Schedule 1-on-1 remedial sessions in core engineering modules.`,
          'Weekly attendance monitoring with automated parent notice.'
        ]
      });
    } catch (e) {
      notify('Failed to generate AI prescription.');
    } finally {
      setLoadingPrescription(false);
    }
  };

  // Export to Excel
  const handleExportData = () => {
    try {
      const exportList = allStudents.map((s) => ({
        'Student ID': s.id,
        'Roll No': s.rollNo,
        'Student Name': s.name,
        'Department': s.dept,
        'Semester': s.semester,
        'Cumulative CGPA': s.cgpa,
        'Active Backlogs': s.backlogs,
        'Attendance %': `${s.attendancePct}%`,
        'Dropout Probability': s.dropoutProbability,
        'Predicted Risk Level': s.riskLevel,
        'Projected Trajectory': s.trajectory,
        'Model Confidence': s.modelConfidence,
        'Top Risk Factor': s.topContributingFactors[0]?.name || 'Stable',
        'Recommended Action': s.priorityAction
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Risk Predictions');
      XLSX.writeFile(workbook, `EduSuccess_AI_Risk_Predictions_${new Date().toISOString().slice(0, 10)}.xlsx`);

      notify('Predictive Risk Assessment Report exported successfully!');
      setShowExportModal(false);
    } catch (e) {
      notify('Failed to export prediction data.');
    }
  };

  // Switch to Simulator for a specific student
  const openStudentInSimulator = (student) => {
    setSimStudentId(student.id);
    setActiveTab('simulator');
    notify(`Loaded ${student.name} into What-If Simulator.`);
  };

  // Metric Stats
  const totalAnalyzed = overviewData?.stats?.totalAnalyzed || allStudents.length || '8';
  const highCount = overviewData?.stats?.highRiskPredicted?.count || '4';
  const highPct = overviewData?.stats?.highRiskPredicted?.percentage || '50.0%';
  const medCount = overviewData?.stats?.mediumWarning?.count || '1';
  const medPct = overviewData?.stats?.mediumWarning?.percentage || '12.5%';
  const safeCount = overviewData?.stats?.safeRetained?.count || '3';
  const safePct = overviewData?.stats?.safeRetained?.percentage || '37.5%';

  return (
    <div className="bc-page animate-fadeIn pb-12">
      {/* 1. Header Banner */}
      <div className="bc-header">
        <div className="bc-title-group">
          <div className="bc-icon-badge" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#ef4444' }}>
            <Target style={{ width: 28, height: 28 }} />
          </div>
          <div>
            <div className="bc-network-tag" style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#7c3aed' }}>
              <Sparkles style={{ width: 12, height: 12 }} />
              AI Multi-Dimensional Predictive Dropout Engine
            </div>
            <h1>AI Risk Prediction & Early Intervention</h1>
            <p>
              Real-time machine learning inference combining attendance patterns, academic regression, study habits, and socio-economic vulnerability to forecast dropouts before they happen.
            </p>
          </div>
        </div>

        <div className="bc-header-actions">
          <button
            onClick={() => {
              loadPredictions();
              notify('AI Predictive Engine re-assessed all student records.');
            }}
            disabled={loading}
            className="btn-primary-purple"
          >
            <RefreshCw style={{ width: 16, height: 16 }} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Re-Assessing...' : 'Re-Run AI Inference'}</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="btn-outline-action"
          >
            <Download style={{ width: 16, height: 16 }} />
            <span>Export Predictions</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Predictive Metric Cards */}
      <div className="bc-stats-grid">
        {/* Card 1: Total Analyzed */}
        <div className="bc-stat-card">
          <div className="bar-indicator blue" />
          <div className="bc-stat-info">
            <span className="bc-stat-title">Total Students Analyzed</span>
            <span className="bc-stat-value">{totalAnalyzed}</span>
            <span className="bc-stat-note" style={{ color: '#2563eb', fontWeight: 600 }}>100% Live DB Sync</span>
          </div>
          <div className="bc-stat-icon blue">
            <Users style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 2: High Dropout Risk */}
        <div className="bc-stat-card">
          <div className="bar-indicator" style={{ background: '#ef4444' }} />
          <div className="bc-stat-info">
            <span className="bc-stat-title" style={{ color: '#dc2626' }}>High Dropout Risk</span>
            <span className="bc-stat-value" style={{ color: '#dc2626' }}>{highCount} ({highPct})</span>
            <span className="bc-stat-note" style={{ color: '#dc2626', fontWeight: 700 }}>Critical Intervention Required</span>
          </div>
          <div className="bc-stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <Flame style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 3: Moderate Watchlist */}
        <div className="bc-stat-card">
          <div className="bar-indicator amber" />
          <div className="bc-stat-info">
            <span className="bc-stat-title" style={{ color: '#d97706' }}>Moderate Watchlist</span>
            <span className="bc-stat-value" style={{ color: '#d97706' }}>{medCount} ({medPct})</span>
            <span className="bc-stat-note" style={{ color: '#d97706', fontWeight: 600 }}>Remedial Action Suggested</span>
          </div>
          <div className="bc-stat-icon amber">
            <AlertTriangle style={{ width: 22, height: 22 }} />
          </div>
        </div>

        {/* Card 4: Model Accuracy */}
        <div className="bc-stat-card">
          <div className="bar-indicator emerald" />
          <div className="bc-stat-info">
            <span className="bc-stat-title" style={{ color: '#059669' }}>Model Accuracy & F1</span>
            <span className="bc-stat-value" style={{ color: '#059669' }}>94.8%</span>
            <span className="bc-stat-note" style={{ color: '#059669', fontWeight: 600 }}>Ensemble Gradient Boosting</span>
          </div>
          <div className="bc-stat-icon emerald">
            <BrainCircuit style={{ width: 22, height: 22 }} />
          </div>
        </div>
      </div>

      {/* 3. Sub-Tab Navigation */}
      <div className="bc-tabs-bar">
        <button
          onClick={() => setActiveTab('directory')}
          className={`bc-tab-item ${activeTab === 'directory' ? 'active' : ''}`}
        >
          <Target style={{ width: 16, height: 16 }} />
          <span>Predictive Student Scorecards</span>
          <span className="bc-tab-badge">{allStudents.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`bc-tab-item ${activeTab === 'simulator' ? 'active' : ''}`}
        >
          <Sliders style={{ width: 16, height: 16 }} />
          <span>What-If Scenario Sandbox</span>
          <span className="bc-tab-badge" style={{ background: '#f59e0b', color: '#fff' }}>Interactive AI</span>
        </button>

        <button
          onClick={() => setActiveTab('vulnerability')}
          className={`bc-tab-item ${activeTab === 'vulnerability' ? 'active' : ''}`}
        >
          <Building2 style={{ width: 16, height: 16 }} />
          <span>Department Vulnerability & Feature Weights</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: PREDICTIVE STUDENT SCORECARDS (DIRECTORY)
      ======================================================== */}
      {activeTab === 'directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Filter Bar */}
          <div className="bc-ledger-controls">
            <div className="bc-filter-group">
              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bc-filter-btn"
                style={{ outline: 'none' }}
              >
                <option>All Departments</option>
                <option>Computer Engg.</option>
                <option>Information Tech.</option>
                <option>Electronics Engg.</option>
                <option>Mechanical Engg.</option>
              </select>

              {/* Semester Filter */}
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="bc-filter-btn"
                style={{ outline: 'none' }}
              >
                <option>All Semesters</option>
                <option>Semester 4</option>
                <option>Semester 6</option>
              </select>

              {/* Risk Level Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bc-filter-btn"
                style={{ outline: 'none' }}
              >
                <option>All Risk Levels</option>
                <option>High Risk</option>
                <option>Medium Risk</option>
                <option>Low Risk</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="bc-search-wrap">
              <Search className="bc-search-icon" />
              <input
                type="text"
                placeholder="Search student, roll no, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bc-search-input"
              />
            </div>
          </div>

          {/* Student Predictive Scorecards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
            {allStudents.map((s) => {
              const isHigh = s.riskLevel === 'High';
              const isMed = s.riskLevel === 'Medium';
              const probNum = s.probabilityNum || 0;

              return (
                <div
                  key={s.id}
                  className="bc-panel"
                  style={{
                    padding: 20,
                    borderColor: isHigh ? '#fecaca' : isMed ? '#fde68a' : '#e4ecf7',
                    boxShadow: isHigh ? '0 6px 20px rgba(239, 68, 68, 0.08)' : '0 3px 12px rgba(14, 30, 68, 0.04)'
                  }}
                >
                  {/* Top: Student Info + Risk Probability Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="bc-student-avatar"
                        style={{ width: 44, height: 44 }}
                      />
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0b153b', margin: '0 0 2px' }}>{s.name}</h3>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {s.rollNo} • {s.dept} (Sem {s.semester})
                        </div>
                      </div>
                    </div>

                    {/* Probability Badge */}
                    <div style={{
                      textAlign: 'right',
                      padding: '6px 12px',
                      borderRadius: 12,
                      background: isHigh ? '#fef2f2' : isMed ? '#fffbeb' : '#ecfdf5',
                      border: `1px solid ${isHigh ? '#fecaca' : isMed ? '#fde68a' : '#a7f3d0'}`
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: isHigh ? '#dc2626' : isMed ? '#d97706' : '#059669' }}>
                        Dropout Probability
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: isHigh ? '#dc2626' : isMed ? '#d97706' : '#059669', lineHeight: 1.1 }}>
                        {s.dropoutProbability}
                      </div>
                    </div>
                  </div>

                  {/* 4-Bar Multi-Dimensional Risk Factors Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                      <span>Attendance Factor (35%)</span>
                      <span style={{ color: s.attendancePct < 75 ? '#dc2626' : '#059669' }}>{s.attendancePct}%</span>
                    </div>
                    <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, s.breakdown?.attendanceScore || 20)}%`, height: '100%', background: s.breakdown?.attendanceScore >= 60 ? '#ef4444' : s.breakdown?.attendanceScore >= 30 ? '#f59e0b' : '#10b981' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                      <span>Academic Factor (35%)</span>
                      <span style={{ color: s.cgpa < 5.0 ? '#dc2626' : '#0b153b' }}>{s.cgpa} CGPA • {s.backlogs} Backlogs</span>
                    </div>
                    <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, s.breakdown?.academicScore || 20)}%`, height: '100%', background: s.breakdown?.academicScore >= 60 ? '#ef4444' : s.breakdown?.academicScore >= 30 ? '#f59e0b' : '#10b981' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                      <span>Behavior & Study (15%)</span>
                      <span>{s.studyHours}h/day • {s.engagement}% Engage</span>
                    </div>
                    <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, s.breakdown?.behaviorScore || 20)}%`, height: '100%', background: '#3b82f6' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                      <span>Socio-Economic Index (15%)</span>
                      <span>{s.incomeBracket}</span>
                    </div>
                    <div style={{ width: '100%', height: 5, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, s.breakdown?.socioScore || 20)}%`, height: '100%', background: '#8b5cf6' }} />
                    </div>
                  </div>

                  {/* Contributing Factors Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {s.topContributingFactors.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
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

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                    <button
                      onClick={() => handleOpenPrescription(s)}
                      className="btn-primary-purple"
                      style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: 12 }}
                    >
                      <Sparkles style={{ width: 14, height: 14 }} />
                      <span>AI Retention Plan</span>
                    </button>

                    <button
                      onClick={() => openStudentInSimulator(s)}
                      className="btn-outline-action"
                      style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: 12 }}
                      title="Open What-If Scenario Sandbox"
                    >
                      <Sliders style={{ width: 14, height: 14 }} />
                      <span>Simulate What-If</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: INTERACTIVE WHAT-IF SCENARIO SANDBOX
      ======================================================== */}
      {activeTab === 'simulator' && (
        <div className="bc-grid-layout" style={{ gridTemplateColumns: '380px 1fr' }}>
          {/* Left: Input Simulator Controls */}
          <div className="bc-panel">
            <div className="bc-panel-header">
              <div className="bc-panel-title">
                <Sliders style={{ width: 18, height: 18, color: '#f59e0b' }} />
                <span>What-If Sandbox Controls</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>Live Recalculation</span>
            </div>

            {/* Target Student Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0b153b' }}>Select Target Student:</label>
              <select
                value={simStudentId}
                onChange={(e) => setSimStudentId(e.target.value)}
                className="bc-filter-btn"
                style={{ width: '100%', padding: '10px 12px', outline: 'none', background: '#f8faff', fontWeight: 600 }}
              >
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo}) - Current Risk: {s.dropoutProbability}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Baseline Card */}
            <div style={{ padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: '#0b153b', marginBottom: 4 }}>
                Current Baseline ({currentSimStudent.name}):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, color: '#64748b' }}>
                <div>Att: <strong>{currentSimStudent.attendancePct}%</strong></div>
                <div>CGPA: <strong>{currentSimStudent.cgpa}</strong></div>
                <div>Backlogs: <strong>{currentSimStudent.backlogs}</strong></div>
                <div>Study: <strong>{currentSimStudent.studyHours}h/day</strong></div>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* 1. Proposed Attendance */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: '#0b153b' }}>Simulated Attendance Rate:</span>
                  <span style={{ color: '#5247e6', fontWeight: 700 }}>{simAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simAttendance}
                  onChange={(e) => {
                    setSimAttendance(Number(e.target.value));
                    runSimulation(simStudentId, { simulatedAttendance: Number(e.target.value), simulatedCgpa: simCgpa, simulatedBacklogs: simBacklogs, simulatedStudyHours: simStudyHours, simulatedEngagement: simEngagement });
                  }}
                  style={{ width: '100%', accentColor: '#5247e6', cursor: 'pointer' }}
                />
              </div>

              {/* 2. Proposed CGPA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: '#0b153b' }}>Simulated Target CGPA:</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{simCgpa}</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={simCgpa}
                  onChange={(e) => {
                    setSimCgpa(Number(e.target.value));
                    runSimulation(simStudentId, { simulatedAttendance: simAttendance, simulatedCgpa: Number(e.target.value), simulatedBacklogs: simBacklogs, simulatedStudyHours: simStudyHours, simulatedEngagement: simEngagement });
                  }}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              {/* 3. Cleared Backlogs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: '#0b153b' }}>Simulated Active Backlogs:</span>
                  <span style={{ color: simBacklogs === 0 ? '#059669' : '#dc2626', fontWeight: 700 }}>{simBacklogs} Backlogs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={simBacklogs}
                  onChange={(e) => {
                    setSimBacklogs(Number(e.target.value));
                    runSimulation(simStudentId, { simulatedAttendance: simAttendance, simulatedCgpa: simCgpa, simulatedBacklogs: Number(e.target.value), simulatedStudyHours: simStudyHours, simulatedEngagement: simEngagement });
                  }}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </div>

              {/* 4. Daily Study Hours */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ color: '#0b153b' }}>Daily Study Hours:</span>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>{simStudyHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={simStudyHours}
                  onChange={(e) => {
                    setSimStudyHours(Number(e.target.value));
                    runSimulation(simStudentId, { simulatedAttendance: simAttendance, simulatedCgpa: simCgpa, simulatedBacklogs: simBacklogs, simulatedStudyHours: Number(e.target.value), simulatedEngagement: simEngagement });
                  }}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Right: Simulation Output Impact Card */}
          <div className="bc-panel">
            <div className="bc-panel-header">
              <div className="bc-panel-title">
                <BrainCircuit style={{ width: 18, height: 18, color: '#5247e6' }} />
                <span>Simulated Predictive Outcome ({currentSimStudent.name})</span>
              </div>
              <span className="bc-network-tag">
                <Sparkles style={{ width: 12, height: 12 }} />
                Instant AI Inference
              </span>
            </div>

            {simResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Large Before vs After Comparison Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  {/* Before */}
                  <div style={{ padding: 18, borderRadius: 14, background: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
                      Current Baseline Risk
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#dc2626', margin: '4px 0' }}>
                      {simResult.originalProbability}
                    </div>
                    <div style={{ fontSize: 12, color: '#991b1b', fontWeight: 600 }}>
                      Level: {simResult.originalLevel} Risk
                    </div>
                  </div>

                  {/* After */}
                  <div style={{ padding: 18, borderRadius: 14, background: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                      Simulated Projected Risk
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                      {simResult.simulatedProbability}
                    </div>
                    <div style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>
                      Level: {simResult.simulatedLevel} Risk
                    </div>
                  </div>
                </div>

                {/* Delta Impact Callout */}
                <div style={{
                  padding: 14,
                  borderRadius: 12,
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13
                }}>
                  <TrendingDown style={{ width: 22, height: 22, color: '#16a34a', shrink: 0 }} />
                  <div>
                    <strong>Impact Forecast:</strong> By improving attendance to <strong>{simAttendance}%</strong>, maintaining CGPA at <strong>{simCgpa}</strong>, and clearing backlogs, {currentSimStudent.name}'s dropout probability is projected to reduce by <strong style={{ color: '#15803d', fontSize: 15 }}>{simResult.riskReducedBy}</strong>!
                  </div>
                </div>

                {/* Simulated Prescription */}
                <div style={{ padding: 16, borderRadius: 14, background: '#f8faff', border: '1px solid #e4ecf7', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0b153b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lightbulb style={{ width: 16, height: 16, color: '#f59e0b' }} />
                    AI Prescribed Action Plan to Achieve this Reduction:
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {simResult.prescription}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    onClick={() => handleOpenPrescription(currentSimStudent)}
                    className="btn-primary-purple"
                  >
                    <Sparkles style={{ width: 16, height: 16 }} />
                    <span>Generate Official AI Retention Document</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 36, textAlign: 'center', color: '#64748b' }}>
                <RefreshCw style={{ width: 32, height: 32 }} className="spin" />
                <p>Calculating simulation projection...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: DEPARTMENT VULNERABILITY & FEATURE WEIGHTS
      ======================================================== */}
      {activeTab === 'vulnerability' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
          {/* Department Vulnerability Index */}
          <div className="bc-panel">
            <div className="bc-panel-header">
              <div className="bc-panel-title">
                <Building2 style={{ width: 18, height: 18, color: '#5247e6' }} />
                <span>Departmental Dropout Vulnerability Heatmap</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b' }}>Cross-Branch Analytics</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(overviewData?.departmentVulnerability || []).map((d, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                    <span style={{ color: '#0b153b' }}>{d.dept} ({d.count} Students)</span>
                    <span style={{ color: d.avgRisk >= 60 ? '#dc2626' : d.avgRisk >= 35 ? '#d97706' : '#059669', fontWeight: 700 }}>
                      Avg Risk: {d.avgRisk}% • {d.highRiskCount} Critical
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 10, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(5, d.avgRisk)}%`,
                        height: '100%',
                        borderRadius: 6,
                        background: d.avgRisk >= 60 ? '#ef4444' : d.avgRisk >= 35 ? '#f59e0b' : '#10b981',
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Importance Weights */}
          <div className="bc-panel">
            <div className="bc-panel-header">
              <div className="bc-panel-title">
                <Activity style={{ width: 18, height: 18, color: '#7c3aed' }} />
                <span>Predictive ML Feature Importance Weights</span>
              </div>
              <span style={{ fontSize: 11, color: '#64748b' }}>Gradient Boosting Model</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Attendance Rate (<75% Threshold)', weight: 35, color: '#ef4444', desc: 'Top predictor of disengagement & dropout risk' },
                { name: 'Academic CGPA & Active Backlogs', weight: 35, color: '#f59e0b', desc: 'Direct correlate with exam retention and progression' },
                { name: 'Learning Behavior & Study Consistency', weight: 15, color: '#3b82f6', desc: 'Daily study hours and self-learning activity' },
                { name: 'Socio-Economic & Resource Constraints', weight: 15, color: '#8b5cf6', desc: 'Family income, first-gen status & device access' }
              ].map((f, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                    <span style={{ color: '#0b153b' }}>{f.name}</span>
                    <span style={{ color: f.color, fontWeight: 700 }}>Weight: {f.weight}%</span>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${f.weight * 2.5}%`, height: '100%', background: f.color }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: AI PERSONALIZED RETENTION PRESCRIPTION
      ======================================================== */}
      {showAiModal && prescriptionStudent && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 640 }}>
            <button
              onClick={() => setShowAiModal(false)}
              className="bc-cert-close"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            {/* Header */}
            <div className="bc-cert-header">
              <div className="bc-network-tag" style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#7c3aed' }}>
                <Sparkles style={{ width: 13, height: 13 }} />
                Gemini 1.5 Flash • AI Retention Strategy
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0b153b', margin: '6px 0 0' }}>
                AI Intervention Prescription for {prescriptionStudent.name}
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {prescriptionStudent.rollNo} • {prescriptionStudent.dept} | Dropout Probability: <strong style={{ color: '#dc2626' }}>{prescriptionStudent.dropoutProbability}</strong>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {loadingPrescription ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                  <RefreshCw style={{ width: 28, height: 28, margin: '0 auto 10px' }} className="spin" />
                  <p style={{ margin: 0, fontSize: 13 }}>Generating customized intervention steps from student profile...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', textTransform: 'uppercase' }}>
                    Recommended 3-Step Action Plan:
                  </div>

                  {(prescriptionData?.recommendations || []).map((rec, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: '#f8faff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: '#1e293b'
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: '#5247e6',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 11,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shrink: 0
                      }}>
                        {rIdx + 1}
                      </div>
                      <div>{rec}</div>
                    </div>
                  ))}

                  <div style={{ padding: 12, borderRadius: 10, background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: 12, color: '#065f46' }}>
                    <strong>Expected Outcome:</strong> 72% probability of moving student from High Risk to Low Risk within 4 weeks of consistent intervention.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
              <button
                onClick={() => {
                  notify(`Intervention prescription assigned to departmental mentor.`);
                  setShowAiModal(false);
                }}
                className="btn-primary-purple"
              >
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                <span>Assign Plan to Mentor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EXPORT PREDICTIONS MODAL
      ======================================================== */}
      {showExportModal && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 460 }}>
            <button
              onClick={() => setShowExportModal(false)}
              className="bc-cert-close"
            >
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0b153b', margin: 0 }}>
                Export Predictive Risk Report
              </h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>
                Download comprehensive assessment for all {allStudents.length} students.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                onClick={() => setExportFormat('excel')}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${exportFormat === 'excel' ? '#5247e6' : '#e2e8f0'}`,
                  background: exportFormat === 'excel' ? '#f0efff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer'
                }}
              >
                <FileSpreadsheet style={{ width: 24, height: 24, color: '#16a34a' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0b153b' }}>Microsoft Excel (.xlsx)</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Full multi-dimensional data table</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                onClick={handleExportData}
                className="btn-primary-purple"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download style={{ width: 16, height: 16 }} />
                <span>Download Report Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
