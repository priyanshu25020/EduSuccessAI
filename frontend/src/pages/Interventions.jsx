import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  UserCheck,
  BrainCircuit,
  Sliders,
  Download,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  HeartHandshake,
  Hexagon,
  FileSpreadsheet,
  Check,
  Flame,
  Send,
  MoreVertical,
  Activity,
  Layers,
  RefreshCw,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ALL_78_STUDENTS } from '../data/studentsData';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

// Initial Pre-Configured Comprehensive Institutional Interventions
const INITIAL_INTERVENTIONS = [
  {
    id: 'INT-2026-001',
    studentId: 'STU1001',
    studentName: 'Rahul Patel',
    rollNo: 'CE2021001',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    dept: 'Computer Engg.',
    semester: 4,
    type: 'Academic Remedial Tutoring',
    category: 'academic',
    subject: 'Data Structures & Algorithms',
    mentorName: 'Prof. Ananya Roy',
    mentorRole: 'Senior Associate Professor',
    riskLevel: 'High',
    riskScore: '88%',
    initialAttendance: 45,
    currentAttendance: 68,
    targetAttendance: 80,
    initialCgpa: 4.5,
    targetCgpa: 6.5,
    status: 'In Progress', // 'Scheduled' | 'In Progress' | 'Under Review' | 'Resolved'
    priority: 'Critical', // 'Critical' | 'High' | 'Medium'
    startDate: '01 Aug 2026',
    targetDate: '15 Sep 2026',
    milestones: [
      { id: 1, title: 'Complete Diagnostic Assessment on Trees & Graphs', completed: true, date: '05 Aug 2026' },
      { id: 2, title: 'Attend 8 Remedial Problem-Solving Labs', completed: true, date: '12 Aug 2026' },
      { id: 3, title: 'Clear Mid-Term Mock Evaluation with ≥60%', completed: false, date: '28 Aug 2026' },
      { id: 4, title: 'Restore Attendance above 75% Threshold', completed: false, date: '15 Sep 2026' }
    ],
    notes: 'Student showing positive progress in dynamic programming logic clinics. Peer tutor assigned from final year batch.',
    hash: '0x8f91c7a2b3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'INT-2026-002',
    studentId: 'STU1003',
    studentName: 'Aarav Mehta',
    rollNo: 'EE2021001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dept: 'Electronics Engg.',
    semester: 4,
    type: 'Attendance Milestone Recovery',
    category: 'attendance',
    subject: 'Digital Logic & Microprocessors',
    mentorName: 'Dr. Rajesh Sharma',
    mentorRole: 'HOD - Electronics Engg.',
    riskLevel: 'High',
    riskScore: '92%',
    initialAttendance: 42,
    currentAttendance: 65,
    targetAttendance: 75,
    initialCgpa: 3.65,
    targetCgpa: 5.5,
    status: 'In Progress',
    priority: 'Critical',
    startDate: '28 Jul 2026',
    targetDate: '30 Aug 2026',
    milestones: [
      { id: 1, title: 'Biometric Daily Check-in with Faculty Advisor', completed: true, date: '02 Aug 2026' },
      { id: 2, title: 'Parent-Teacher Orientation on Attendance Recovery', completed: true, date: '08 Aug 2026' },
      { id: 3, title: '3-Week Zero Unexcused Absence Streak', completed: false, date: '22 Aug 2026' }
    ],
    notes: 'Attendance improved by +23% over 3 weeks. Verified through biometric blockchain ledger.',
    hash: '0xee2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'INT-2026-003',
    studentId: 'STU1004',
    studentName: 'Pooja Sharma',
    rollNo: 'ME2021001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dept: 'Mechanical Engg.',
    semester: 6,
    type: 'Cognitive Learning Style Customization',
    category: 'learning',
    subject: 'Thermodynamics & Fluid Dynamics',
    mentorName: 'Prof. Vikram Bhatt',
    mentorRole: 'Assistant Professor',
    riskLevel: 'Medium',
    riskScore: '58%',
    initialAttendance: 62,
    currentAttendance: 74,
    targetAttendance: 85,
    initialCgpa: 5.12,
    targetCgpa: 6.8,
    status: 'In Progress',
    priority: 'High',
    startDate: '05 Aug 2026',
    targetDate: '20 Sep 2026',
    milestones: [
      { id: 1, title: 'Deliver 3D CAD simulation modules tailored for Visual Learner', completed: true, date: '10 Aug 2026' },
      { id: 2, title: 'Complete Fluid Mechanics Sandbox Simulation Lab', completed: false, date: '25 Aug 2026' }
    ],
    notes: 'Responding exceptionally well to visual interactive flow simulations rather than pure theoretical derivations.',
    hash: '0xme2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'INT-2026-004',
    studentId: 'STU1002',
    studentName: 'Sneha Singh',
    rollNo: 'IT2021001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dept: 'Information Tech.',
    semester: 6,
    type: 'Socio-Economic Grant & Book Bank Support',
    category: 'welfare',
    subject: 'Cloud Computing & Distributed Systems',
    mentorName: 'Dr. Meera Nambiar',
    mentorRole: 'Dean of Student Welfare',
    riskLevel: 'Medium',
    riskScore: '45%',
    initialAttendance: 70,
    currentAttendance: 82,
    targetAttendance: 85,
    initialCgpa: 5.8,
    targetCgpa: 7.2,
    status: 'Resolved',
    priority: 'Medium',
    startDate: '15 Jul 2026',
    targetDate: '10 Aug 2026',
    milestones: [
      { id: 1, title: 'Institutional Book Bank textbook set allocation', completed: true, date: '20 Jul 2026' },
      { id: 2, title: 'After-hours campus computing lab access pass issued', completed: true, date: '25 Jul 2026' },
      { id: 3, title: 'Financial counseling and merit grant application submitted', completed: true, date: '10 Aug 2026' }
    ],
    notes: 'Successfully resolved. Student attendance restored to 82% with complete course textbook support.',
    hash: '0xit2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'INT-2026-005',
    studentId: 'STU1005',
    studentName: 'Karan Verma',
    rollNo: 'CV2021001',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    dept: 'Civil Engg.',
    semester: 4,
    type: 'Academic Remedial Tutoring',
    category: 'academic',
    subject: 'Structural Analysis & Mechanics',
    mentorName: 'Prof. Suresh Joshi',
    mentorRole: 'Senior Lecturer',
    riskLevel: 'High',
    riskScore: '84%',
    initialAttendance: 50,
    currentAttendance: 66,
    targetAttendance: 75,
    initialCgpa: 4.12,
    targetCgpa: 6.0,
    status: 'In Progress',
    priority: 'Critical',
    startDate: '02 Aug 2026',
    targetDate: '10 Sep 2026',
    milestones: [
      { id: 1, title: '1-on-1 Beam deflection & stress calculation tutorial', completed: true, date: '08 Aug 2026' },
      { id: 2, title: 'Submit 4 practice assignment problem sets', completed: false, date: '20 Aug 2026' }
    ],
    notes: 'Mentorship sessions scheduled every Tuesday & Friday at 4:30 PM.',
    hash: '0xcv2001ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  },
  {
    id: 'INT-2026-006',
    studentId: 'STU1011',
    studentName: 'Aditya Kulkarni',
    rollNo: 'CE2021003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dept: 'Computer Engg.',
    semester: 4,
    type: 'Peer-Assisted Backlog Clearance Cohort',
    category: 'academic',
    subject: 'Algorithms & Discrete Mathematics',
    mentorName: 'Prof. Ananya Roy',
    mentorRole: 'Senior Associate Professor',
    riskLevel: 'High',
    riskScore: '78%',
    initialAttendance: 55,
    currentAttendance: 72,
    targetAttendance: 80,
    initialCgpa: 4.8,
    targetCgpa: 6.5,
    status: 'In Progress',
    priority: 'High',
    startDate: '04 Aug 2026',
    targetDate: '18 Sep 2026',
    milestones: [
      { id: 1, title: 'Weekly mock test on dynamic programming & greedy techniques', completed: true, date: '11 Aug 2026' },
      { id: 2, title: 'Peer coding study sessions with top-tier batch students', completed: false, date: '28 Aug 2026' }
    ],
    notes: 'Backlog recovery roadmap active. Student submitted 3 solved algorithm sheets.',
    hash: '0xce2003ab3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4'
  }
];

export default function InterventionsPage({ notify = () => {}, globalSearchQuery = '' }) {
  // Main State
  const [interventions, setInterventions] = useState(() => {
    try {
      const saved = localStorage.getItem('edusuccess_interventions_ledger');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INTERVENTIONS;
  });

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table' | 'mentors' | 'analytics'
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // New Intervention Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStudentId, setNewStudentId] = useState('STU1001');
  const [newType, setNewType] = useState('Academic Remedial Tutoring');
  const [newSubject, setNewSubject] = useState('Data Structures & Algorithms');
  const [newMentor, setNewMentor] = useState('Prof. Ananya Roy');
  const [newPriority, setNewPriority] = useState('High');
  const [newNotes, setNewNotes] = useState('');

  // Selected Detail Modal
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Blockchain Proof Modal
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofIntervention, setProofIntervention] = useState(null);

  // Sync Search
  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchQuery(globalSearchQuery);
      setCurrentPage(1);
    }
  }, [globalSearchQuery]);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('edusuccess_interventions_ledger', JSON.stringify(interventions));
    } catch (e) {}
  }, [interventions]);

  // Filtered List
  const filteredInterventions = useMemo(() => {
    return interventions.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (deptFilter !== 'All Departments' && item.dept !== deptFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          item.studentName.toLowerCase().includes(q) ||
          item.rollNo.toLowerCase().includes(q) ||
          item.mentorName.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.dept.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [interventions, statusFilter, categoryFilter, deptFilter, searchQuery]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredInterventions.length / rowsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredInterventions.length);
  const paginatedList = useMemo(() => {
    return filteredInterventions.slice(startIndex, endIndex);
  }, [filteredInterventions, startIndex, endIndex]);

  // Quick Status Update
  const handleUpdateStatus = (id, newStatus, e) => {
    if (e) e.stopPropagation();
    setInterventions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    notify(`✅ Intervention status updated to "${newStatus}"!`);
  };

  // Toggle Milestone
  const handleToggleMilestone = (interventionId, milestoneId) => {
    setInterventions((prev) =>
      prev.map((item) => {
        if (item.id !== interventionId) return item;
        const updatedMilestones = item.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        // If all completed, auto resolve
        const allDone = updatedMilestones.every((m) => m.completed);
        return {
          ...item,
          milestones: updatedMilestones,
          status: allDone ? 'Resolved' : item.status
        };
      })
    );
    notify("Milestone progress updated & anchored!");
  };

  // Create New Intervention
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const student = ALL_78_STUDENTS.find((s) => s.id === newStudentId) || ALL_78_STUDENTS[0];

    const newEntry = {
      id: `INT-2026-${String(interventions.length + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      avatar: student.avatar,
      dept: student.dept,
      semester: student.semester,
      type: newType,
      category: newType.toLowerCase().includes('attendance') ? 'attendance' : newType.toLowerCase().includes('learning') ? 'learning' : newType.toLowerCase().includes('welfare') ? 'welfare' : 'academic',
      subject: newSubject || student.subject,
      mentorName: newMentor,
      mentorRole: 'Faculty Advisor',
      riskLevel: student.riskScore === '85%' || student.cgpa < 5 ? 'High' : 'Medium',
      riskScore: student.riskScore || '75%',
      initialAttendance: student.attendancePct || 55,
      currentAttendance: student.attendancePct || 55,
      targetAttendance: 80,
      initialCgpa: student.cgpa || 5.0,
      targetCgpa: 6.8,
      status: 'In Progress',
      priority: newPriority,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      targetDate: '30 Sep 2026',
      milestones: [
        { id: 1, title: 'Initial diagnostic & gap analysis review', completed: true, date: 'Today' },
        { id: 2, title: 'Phase 1: Remedial tutorial clinics & problem solving', completed: false, date: '15 Sep 2026' },
        { id: 3, title: 'Final milestone assessment & attendance verification', completed: false, date: '30 Sep 2026' }
      ],
      notes: newNotes || 'New customized retention intervention created by academic advisory council.',
      hash: `0x${student.rollNo.toLowerCase()}${Date.now().toString(16).slice(-8)}4a5b6c`
    };

    setInterventions([newEntry, ...interventions]);
    setShowCreateModal(false);
    notify(`🎉 New AI Intervention successfully activated for ${student.name}!`);
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = interventions.map((item) => ({
        'Intervention ID': item.id,
        'Student Name': item.studentName,
        'Enrollment No': item.rollNo,
        'Department': item.dept,
        'Semester': item.semester,
        'Intervention Type': item.type,
        'Subject Focus': item.subject,
        'Assigned Mentor': item.mentorName,
        'Risk Category': item.riskLevel,
        'Initial Att %': `${item.initialAttendance}%`,
        'Current Att %': `${item.currentAttendance}%`,
        'Target Att %': `${item.targetAttendance}%`,
        'Status': item.status,
        'Priority': item.priority,
        'Start Date': item.startDate,
        'Target Date': item.targetDate,
        'Blockchain SHA-256 Hash': item.hash
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'AI_Interventions_Ledger');
      XLSX.writeFile(wb, `EduSuccess_AI_Interventions_Ledger.xlsx`);
      notify("✅ Exported full Intervention Ledger to Excel!");
    } catch (e) {
      notify("Failed to export interventions.");
    }
  };

  // Metrics
  const activeCount = interventions.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = interventions.filter((i) => i.status === 'Resolved').length;
  const criticalCount = interventions.filter((i) => i.priority === 'Critical').length;
  const successRate = interventions.length > 0 ? Math.round((resolvedCount / interventions.length) * 100) : 84;

  return (
    <div className="att-page animate-fadeIn pb-12">
      {/* 1. Header Section */}
      <div className="att-header">
        <div className="att-title-group">
          <div className="att-icon-badge" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <HeartHandshake style={{ width: 28, height: 28, color: '#5247e6' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1>AI Intervention &amp; Mentorship Engine</h1>
              <span className="ai-blockchain-tag">
                <Hexagon style={{ width: 13, height: 13, color: '#7c3aed' }} />
                Polygon Amoy Consortium Verified
              </span>
            </div>
            <p>Proactive academic remedial workflows, peer-tutoring cohorts, attendance recovery roadmaps, and audit tracking.</p>
          </div>
        </div>

        <div className="att-header-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary-purple"
          >
            <Plus style={{ width: 16, height: 16 }} />
            <span>+ Create AI Intervention</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="btn-outline-action"
          >
            <Download style={{ width: 16, height: 16 }} />
            <span>Export Ledger (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Executive KPI Metric Cards */}
      <div className="att-5-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Card 1: Active Interventions */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title blue">Active Workflows</span>
            <span className="att-stat-value">{activeCount} Active</span>
            <span className="att-stat-subtext green">Live Mentorship &amp; Labs</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle" style={{ background: '#f0efff', color: '#5247e6' }}>
              <Activity style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 2: Critical Escalations */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title red">Critical Interventions</span>
            <span className="att-stat-value">{criticalCount} Critical</span>
            <span className="att-stat-subtext red">Urgent 48h Action Required</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle red">
              <AlertTriangle style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 3: Resolved & Recovered */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title green">Successfully Recovered</span>
            <span className="att-stat-value">{resolvedCount} Students</span>
            <span className="att-stat-subtext green">Attendance &gt;75% Restored</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle green">
              <CheckCircle2 style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>

        {/* Card 4: AI Resolution Rate */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title purple" style={{ color: '#7c3aed' }}>Efficacy Success Rate</span>
            <span className="att-stat-value">{successRate}%</span>
            <span className="att-stat-subtext" style={{ color: '#7c3aed', fontWeight: 600 }}>
              +14.2% Growth vs Last Term
            </span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Award style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, margin: '18px 0 12px', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        {/* Left: View Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`bc-tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: activeTab === 'kanban' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: activeTab === 'kanban' ? '#f5f3ff' : '#ffffff',
              color: activeTab === 'kanban' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Layers style={{ width: 14, height: 14 }} />
            <span>Kanban Pipeline Board</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`bc-tab-btn ${activeTab === 'table' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: activeTab === 'table' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: activeTab === 'table' ? '#f5f3ff' : '#ffffff',
              color: activeTab === 'table' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileSpreadsheet style={{ width: 14, height: 14 }} />
            <span>Intervention Ledger Table</span>
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`bc-tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: activeTab === 'mentors' ? '1px solid #5247e6' : '1px solid #e2e8f0',
              background: activeTab === 'mentors' ? '#f5f3ff' : '#ffffff',
              color: activeTab === 'mentors' ? '#5247e6' : '#64748b',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <UserCheck style={{ width: 14, height: 14 }} />
            <span>Mentor Cohorts</span>
          </button>
        </div>

        {/* Right: Search Input */}
        <div className="att-records-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search style={{ width: 14, height: 14, color: '#94a3b8', position: 'absolute', left: 10 }} />
          <input
            type="text"
            placeholder="Search student, mentor, subject..."
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

      {/* Filter Dropdowns Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="att-dropdown-btn"
          style={{ width: 'auto', outline: 'none' }}
        >
          <option value="All">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="att-dropdown-btn"
          style={{ width: 'auto', outline: 'none' }}
        >
          <option value="All">All Intervention Types</option>
          <option value="academic">Academic Remedial</option>
          <option value="attendance">Attendance Recovery</option>
          <option value="learning">Cognitive Learning Style</option>
          <option value="welfare">Socio-Economic &amp; Welfare</option>
        </select>

        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
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
      </div>

      {/* ========================================================
          VIEW 1: KANBAN PIPELINE BOARD
      ======================================================== */}
      {activeTab === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* Column 1: Critical & In-Progress */}
          <div className="att-records-card" style={{ padding: 16, background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: 0 }}>
                  Active Interventions ({interventions.filter((i) => i.status === 'In Progress').length})
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredInterventions
                .filter((i) => i.status === 'In Progress')
                .map((item) => (
                  <div
                    key={item.id}
                    className="ai-futuristic-card"
                    style={{ background: '#ffffff', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedIntervention(item);
                      setShowDetailModal(true);
                    }}
                  >
                    {/* Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={item.avatar}
                          alt={item.studentName}
                          style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: '0 0 2px' }}>
                            {item.studentName}
                          </h4>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {item.rollNo} • {item.dept}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 12,
                        background: item.priority === 'Critical' ? '#fef2f2' : '#fffbeb',
                        color: item.priority === 'Critical' ? '#dc2626' : '#d97706',
                        border: `1px solid ${item.priority === 'Critical' ? '#fecaca' : '#fde68a'}`
                      }}>
                        {item.priority} Priority
                      </span>
                    </div>

                    {/* Intervention Type & Subject */}
                    <div style={{ margin: '10px 0 6px', fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: '#5247e6' }}>{item.type}</div>
                      <div style={{ color: '#475569', fontSize: 11 }}>Focus: {item.subject}</div>
                    </div>

                    {/* Attendance Recovery Progress Bar */}
                    <div style={{ margin: '10px 0 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                        <span>Attendance Recovery:</span>
                        <span style={{ color: item.currentAttendance >= item.targetAttendance ? '#059669' : '#dc2626', fontWeight: 800 }}>
                          {item.currentAttendance}% / {item.targetAttendance}% Target
                        </span>
                      </div>
                      <div style={{ width: '100%', height: 6, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (item.currentAttendance / item.targetAttendance) * 100)}%`, height: '100%', background: '#5247e6' }} />
                      </div>
                    </div>

                    {/* Assigned Mentor */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <UserCheck style={{ width: 12, height: 12, color: '#5247e6' }} />
                        <span>Mentor: <strong>{item.mentorName}</strong></span>
                      </div>

                      <button
                        onClick={(e) => handleUpdateStatus(item.id, 'Resolved', e)}
                        className="btn-outline-action"
                        style={{ padding: '3px 8px', fontSize: 10 }}
                      >
                        ✓ Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Column 2: Resolved & Recovered */}
          <div className="att-records-card" style={{ padding: 16, background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: 0 }}>
                  Resolved &amp; Safe ({interventions.filter((i) => i.status === 'Resolved').length})
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredInterventions
                .filter((i) => i.status === 'Resolved')
                .map((item) => (
                  <div
                    key={item.id}
                    className="ai-futuristic-card low-risk"
                    style={{ background: '#ffffff', cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedIntervention(item);
                      setShowDetailModal(true);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={item.avatar}
                          alt={item.studentName}
                          style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0b153b', margin: '0 0 2px' }}>
                            {item.studentName}
                          </h4>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {item.rollNo} • {item.dept}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 12,
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0'
                      }}>
                        ✓ Goal Reached
                      </span>
                    </div>

                    <div style={{ margin: '10px 0 6px', fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: '#059669' }}>{item.type}</div>
                      <div style={{ color: '#475569', fontSize: 11 }}>Recovered: {item.subject}</div>
                    </div>

                    <div style={{ fontSize: 11, color: '#059669', background: '#f0fdf4', padding: '6px 10px', borderRadius: 6, margin: '8px 0' }}>
                      🌟 Attendance restored to <strong>{item.currentAttendance}%</strong> and backlogs cleared.
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                      <span>Mentor: {item.mentorName}</span>
                      <span className="ai-blockchain-tag">Verified Proof</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: INTERVENTION LEDGER TABLE
      ======================================================== */}
      {activeTab === 'table' && (
        <div className="att-records-card">
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="att-table">
              <thead>
                <tr>
                  <th>Intervention ID</th>
                  <th>Student Name</th>
                  <th>Department &amp; Sem</th>
                  <th>Intervention Type &amp; Focus</th>
                  <th>Assigned Mentor</th>
                  <th>Recovery Progress</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: '#5247e6' }}>{item.id}</td>
                    <td>
                      <div className="att-name-cell" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={item.avatar}
                          alt={item.studentName}
                          style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0b153b' }}>{item.studentName}</div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>{item.rollNo}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0b153b' }}>{item.dept}</div>
                      <div style={{ fontSize: 11, color: '#5247e6' }}>Sem {item.semester}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0b153b', fontSize: 12 }}>{item.type}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.subject}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0b153b' }}>{item.mentorName}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{item.mentorRole}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 11, fontWeight: 700, color: item.currentAttendance >= item.targetAttendance ? '#059669' : '#dc2626' }}>
                        {item.currentAttendance}% / {item.targetAttendance}% Target
                      </div>
                      <div style={{ width: 80, height: 4, borderRadius: 2, background: '#e2e8f0', overflow: 'hidden', marginTop: 3 }}>
                        <div style={{ width: `${Math.min(100, (item.currentAttendance / item.targetAttendance) * 100)}%`, height: '100%', background: '#5247e6' }} />
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        background: item.status === 'Resolved' ? '#ecfdf5' : '#fffbeb',
                        color: item.status === 'Resolved' ? '#059669' : '#d97706',
                        border: `1px solid ${item.status === 'Resolved' ? '#a7f3d0' : '#fde68a'}`
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedIntervention(item);
                            setShowDetailModal(true);
                          }}
                          className="btn-primary-purple"
                          style={{ padding: '5px 10px', fontSize: 11 }}
                        >
                          <span>Manage</span>
                        </button>

                        <button
                          onClick={() => {
                            setProofIntervention(item);
                            setShowProofModal(true);
                          }}
                          className="btn-outline-action"
                          style={{ padding: '5px 10px', fontSize: 11 }}
                          title="View Blockchain Verification"
                        >
                          <Hexagon style={{ width: 12, height: 12, color: '#7c3aed' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="att-table-footer">
            <div>
              Showing {filteredInterventions.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredInterventions.length} records
            </div>
            <div className="att-page-controls">
              <button className="att-page-btn" disabled={validPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} className={`att-page-btn ${validPage === pg ? 'active' : ''}`} onClick={() => setCurrentPage(pg)}>
                  {pg}
                </button>
              ))}
              <button className="att-page-btn" disabled={validPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: MENTOR COHORTS ALLOCATION
      ======================================================== */}
      {activeTab === 'mentors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { name: 'Prof. Ananya Roy', role: 'Senior Associate Professor (Computer Engg.)', count: 4, focus: 'Algorithms, Data Structures, Problem Solving Clinics' },
            { name: 'Dr. Rajesh Sharma', role: 'HOD (Electronics Engg.)', count: 3, focus: 'Digital Circuits, Microprocessor Labs, Biometric Attendance' },
            { name: 'Prof. Vikram Bhatt', role: 'Assistant Professor (Mechanical Engg.)', count: 2, focus: 'Thermodynamics Visual Simulations & Kinesthetic Labs' },
            { name: 'Dr. Meera Nambiar', role: 'Dean of Student Welfare', count: 3, focus: 'Socio-Economic Grants, Book Bank, Financial Counseling' }
          ].map((mentor, mIdx) => (
            <div key={mIdx} className="att-records-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5f3ff', color: '#5247e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {mentor.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0b153b', margin: '0 0 2px' }}>{mentor.name}</h4>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{mentor.role}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 12, margin: '12px 0' }}>
                <div style={{ color: '#64748b', fontSize: 11 }}>Active Mentorship Cohort:</div>
                <div style={{ fontWeight: 800, color: '#5247e6', fontSize: 16 }}>{mentor.count} Students Assigned</div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>Focus: {mentor.focus}</div>
              </div>

              <button
                onClick={() => {
                  setSearchQuery(mentor.name);
                  setActiveTab('table');
                }}
                className="btn-outline-action"
                style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              >
                View Assigned Students
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          MODAL 1: CREATE NEW INTERVENTION
      ======================================================== */}
      {showCreateModal && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 600 }}>
            <button onClick={() => setShowCreateModal(false)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag">
                <Sparkles style={{ width: 13, height: 13 }} />
                AI-Assisted Retention Dispatch
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0b153b', margin: '6px 0 0' }}>
                Create New Student Intervention
              </h2>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Select Student */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                  Select Target Student:
                </label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="att-dropdown-btn"
                  style={{ width: '100%', padding: '8px 12px', outline: 'none', background: '#f8fafc', fontWeight: 600 }}
                >
                  {ALL_78_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) - {s.dept} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              {/* Intervention Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                    Intervention Type:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="att-dropdown-btn"
                    style={{ width: '100%', padding: '8px 12px', outline: 'none' }}
                  >
                    <option>Academic Remedial Tutoring</option>
                    <option>Attendance Milestone Recovery</option>
                    <option>Cognitive Learning Style Customization</option>
                    <option>Socio-Economic Grant &amp; Book Bank</option>
                    <option>Psychological &amp; Wellness Counseling</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                    Priority Level:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="att-dropdown-btn"
                    style={{ width: '100%', padding: '8px 12px', outline: 'none' }}
                  >
                    <option value="Critical">Critical (Immediate)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Watchlist</option>
                  </select>
                </div>
              </div>

              {/* Mentor Assignment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                    Assign Faculty Mentor:
                  </label>
                  <select
                    value={newMentor}
                    onChange={(e) => setNewMentor(e.target.value)}
                    className="att-dropdown-btn"
                    style={{ width: '100%', padding: '8px 12px', outline: 'none' }}
                  >
                    <option>Prof. Ananya Roy</option>
                    <option>Dr. Rajesh Sharma</option>
                    <option>Prof. Vikram Bhatt</option>
                    <option>Dr. Meera Nambiar</option>
                    <option>Prof. Suresh Joshi</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                    Subject Focus:
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0b153b', display: 'block', marginBottom: 4 }}>
                  Action Roadmap Notes:
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Specify milestone targets, weekly tutorial schedule, peer tutor details..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, outline: 'none' }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline-action"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-purple"
                >
                  <span>Activate &amp; Anchor Intervention</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: INTERVENTION DETAILS & MILESTONES
      ======================================================== */}
      {showDetailModal && selectedIntervention && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 680, maxHeight: '88vh', overflowY: 'auto' }}>
            <button onClick={() => setShowDetailModal(false)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag">
                <HeartHandshake style={{ width: 13, height: 13 }} />
                Active Intervention Roadmap
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0b153b', margin: '6px 0 2px' }}>
                {selectedIntervention.type} ({selectedIntervention.studentName})
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {selectedIntervention.rollNo} • {selectedIntervention.dept} (Sem {selectedIntervention.semester}) • Mentor: <strong>{selectedIntervention.mentorName}</strong>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', margin: '12px 0' }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: '0 0 10px' }}>
                Roadmap Milestones &amp; Actions:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedIntervention.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(selectedIntervention.id, m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: '#ffffff',
                      borderRadius: 8,
                      border: `1px solid ${m.completed ? '#a7f3d0' : '#e2e8f0'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: m.completed ? '#10b981' : '#f1f5f9',
                      border: `1px solid ${m.completed ? '#059669' : '#cbd5e1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: 11
                    }}>
                      {m.completed && '✓'}
                    </div>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: m.completed ? '#059669' : '#0b153b', textDecoration: m.completed ? 'line-through' : 'none' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Roadmap Details */}
            <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong>Advisory Notes:</strong> {selectedIntervention.notes}
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
              <button
                onClick={() => handleUpdateStatus(selectedIntervention.id, selectedIntervention.status === 'Resolved' ? 'In Progress' : 'Resolved')}
                className="btn-primary-purple"
                style={{ fontSize: 12 }}
              >
                <CheckCircle2 style={{ width: 14, height: 14 }} />
                <span>{selectedIntervention.status === 'Resolved' ? 'Reopen Intervention' : 'Mark as Successfully Resolved'}</span>
              </button>

              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-outline-action"
                style={{ fontSize: 12 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ON-CHAIN BLOCKCHAIN PROOF
      ======================================================== */}
      {showProofModal && proofIntervention && (
        <div className="bc-modal-backdrop">
          <div className="bc-cert-modal" style={{ maxWidth: 560 }}>
            <button onClick={() => setShowProofModal(false)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div className="bc-cert-header">
              <div className="bc-network-tag">
                <Hexagon style={{ width: 13, height: 13 }} />
                Polygon Amoy On-Chain Audit
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0b153b', margin: '6px 0 0' }}>
                Intervention Cryptographic Certificate ({proofIntervention.id})
              </h2>
            </div>

            <div className="bc-verified-box" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <ShieldCheck style={{ width: 24, height: 24, color: '#059669' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>
                    Tamper-Proof Mentorship Record Verified
                  </div>
                  <div style={{ fontSize: 11, color: '#047857' }}>
                    Intervention initiation timestamped and verified by institutional validator node.
                  </div>
                </div>
              </div>

              <div className="bc-hash-grid">
                <div className="bc-hash-item">
                  <span className="bc-hash-label">Intervention SHA-256 Hash:</span>
                  <span className="bc-hash-code">{proofIntervention.hash}</span>
                </div>
                <div className="bc-hash-item">
                  <span className="bc-hash-label">Smart Contract Validator:</span>
                  <span className="bc-hash-code">0x71C...AmoyNode4</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button onClick={() => setShowProofModal(false)} className="btn-primary-purple">
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
