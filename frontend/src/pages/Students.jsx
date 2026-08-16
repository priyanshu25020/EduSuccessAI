import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  Download,
  Upload,
  UserPlus,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  TrendingUp,
  GraduationCap,
  Clock,
  Briefcase,
  Layers,
  HeartHandshake,
  Award,
  BookOpen,
  Send,
  Sparkles,
  Check,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  FileCheck,
  Copy,
  MessageSquare,
  Calendar,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ALL_78_STUDENTS } from '../data/studentsData';
import { studentService } from '../services/studentService';
import { aiService } from '../services/aiService';
import { getStudentDeepProfile } from '../data/studentDetailHelpers';
import '../styles/attendance.css';
import '../styles/learning-insights.css';
import '../styles/blockchain.css';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getStoredAttendanceLedger = () => {
  try {
    const saved78 = localStorage.getItem('edusuccess_78_attendance_ledger');
    if (saved78) return JSON.parse(saved78);
    const savedDate = localStorage.getItem('edusuccess_attendance_date_ledger');
    if (savedDate) return JSON.parse(savedDate);
    const savedHist = localStorage.getItem('edusuccess_attendance_history');
    if (savedHist) return JSON.parse(savedHist);
  } catch (e) {}
  return {};
};

const getStoredAnchoredBatches = () => {
  try {
    const saved = localStorage.getItem('edusuccess_78_anchored_batches');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
};

const calculateStudentMonthlyAttendance = (student, targetDateStr = '15 Aug 2026') => {
  const ledger = getStoredAttendanceLedger();
  const anchoredBatches = getStoredAnchoredBatches();
  const rollNo = student.rollNo || student.id;
  const studentHistory = ledger[rollNo] || ledger[student.id] || {};

  const totalLectures = student.totalLectures || 48;
  let attendedCount = 0;
  let totalMarked = 0;

  Object.entries(studentHistory).forEach(([dateStr, rec]) => {
    // BLOCKCHAIN INTEGRITY RULE:
    // Only count attendance if this date's batch has been confirmed/anchored on the blockchain
    const isAnchored = anchoredBatches[dateStr]?.anchored === true;
    if (isAnchored && rec && rec.status && rec.status !== 'Not Marked') {
      totalMarked += 1;
      if (rec.status === 'Present') attendedCount += 1;
      else if (rec.status === 'Late') attendedCount += 0.5;
    }
  });

  const pct = totalMarked > 0 ? parseFloat(((attendedCount / totalLectures) * 100).toFixed(1)) : 0;
  return { pct, attendedLectures: attendedCount, totalLectures, markedCount: totalMarked };
};

const getInitialStudentsWithLiveAttendance = (targetDate = '15 Aug 2026') => {
  return ALL_78_STUDENTS.map((s) => {
    const attStats = calculateStudentMonthlyAttendance(s, targetDate);
    const attPct = attStats.pct;
    const deep = getStudentDeepProfile({ ...s, attendancePct: attPct });
    const riskLevel = deep?.aiSynthesis?.riskLevel || 'Low';
    const riskScore = deep?.aiSynthesis?.dropoutProbability || '20%';

    return {
      ...s,
      riskLevel,
      riskScore,
      attendedLectures: attStats.attendedLectures,
      totalLectures: attStats.totalLectures,
      attendance: `${attPct}%`,
      factors: deep?.aiSynthesis?.riskTriggers?.join(' • ') || 'Consistent Performance',
      style: s.style || 'Visual Learner',
      income: deep?.socioEconomic?.income || '₹1,00,000 - ₹2,00,000'
    };
  });
};

export default function StudentsPage({ notify = () => {}, globalSearchQuery = '', globalDate = '15 Aug 2026' }) {
  const [students, setStudents] = useState(() => getInitialStudentsWithLiveAttendance(globalDate));
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [riskLevel, setRiskLevel] = useState('All Risk Levels');
  const [section, setSection] = useState('All Sections');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Modals & 7-Pillar Drill-Down State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudentForAnalysis, setSelectedStudentForAnalysis] = useState(null);
  const [activePillarTab, setActivePillarTab] = useState(null); // null by default; click card to open
  const [viewCertificateModal, setViewCertificateModal] = useState(null);
  const drillDownRef = useRef(null);

  // Per-Student AI Retention Plans Store: { [studentId]: planObject }
  const [studentAiPlans, setStudentAiPlans] = useState({});
  const [geminiLoading, setGeminiLoading] = useState(false);

  // Deep 7-Pillar Profile for Selected Student
  const currentDeepProfile = useMemo(() => {
    if (!selectedStudentForAnalysis) return null;
    return getStudentDeepProfile(selectedStudentForAnalysis);
  }, [selectedStudentForAnalysis]);

  // Live Auto-Sync on Blockchain Anchor or Ledger updates
  useEffect(() => {
    const handleSync = () => {
      setStudents(getInitialStudentsWithLiveAttendance(globalDate));
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [globalDate]);

  // Smooth scroll handler for pillar card clicks
  const handlePillarClick = (tab) => {
    const newTab = activePillarTab === tab ? null : tab;
    setActivePillarTab(newTab);
    if (newTab) {
      setTimeout(() => {
        drillDownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Live Gemini API Plan Generation specifically for currently selected student
  const handleGenerateLiveGeminiPlan = async () => {
    if (!selectedStudentForAnalysis || !currentDeepProfile) return;
    const currentStudentId = selectedStudentForAnalysis.id;
    setGeminiLoading(true);
    try {
      const planRes = await aiService.generateGeminiRetentionPlan({
        ...currentDeepProfile,
        name: selectedStudentForAnalysis.name,
        rollNo: selectedStudentForAnalysis.rollNo,
        dept: selectedStudentForAnalysis.dept,
        cgpa: selectedStudentForAnalysis.cgpa,
        attendance: selectedStudentForAnalysis.attendance || `${selectedStudentForAnalysis.attendancePct || 0}%`
      });
      setStudentAiPlans((prev) => ({
        ...prev,
        [currentStudentId]: planRes
      }));
      notify(`✨ AI Retention Plan generated for ${selectedStudentForAnalysis.name}!`);
    } catch (err) {
      notify("Failed to generate AI plan: " + err.message);
    } finally {
      setGeminiLoading(false);
    }
  };

  // Pagination (Strict 10 items per page)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Add Form State
  const [addForm, setAddForm] = useState({
    name: '',
    rollNo: '',
    dept: 'Computer Engg.',
    semester: '4',
    section: 'Section A',
    attendancePct: '85',
    cgpa: '7.5',
    backlogs: '0'
  });

  // Excel Import State
  const [importFile, setImportFile] = useState(null);
  const [parsedPreview, setParsedPreview] = useState([]);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  // Load 78 Students Unified Dataset with Live Shared Attendance
  const loadStudents = (targetDate = globalDate) => {
    try {
      const customSaved = localStorage.getItem('edusuccess_custom_students');
      if (customSaved) {
        const customParsed = JSON.parse(customSaved);
        if (Array.isArray(customParsed) && customParsed.length > 0) {
          const withLive = customParsed.map((s) => {
            const attStats = calculateStudentMonthlyAttendance(s, targetDate);
            const attPct = attStats.pct;
            const deep = getStudentDeepProfile({ ...s, attendancePct: attPct });
            return {
              ...s,
              riskLevel: deep?.aiSynthesis?.riskLevel || s.riskLevel || 'Low',
              riskScore: deep?.aiSynthesis?.dropoutProbability || s.riskScore || '20%',
              attendedLectures: attStats.attendedLectures,
              totalLectures: attStats.totalLectures,
              attendance: `${attPct}%`
            };
          });
          setStudents(withLive);
          return;
        }
      }
      setStudents(getInitialStudentsWithLiveAttendance(targetDate));
    } catch (e) {
      console.warn('Error loading synchronized students:', e);
      setStudents(getInitialStudentsWithLiveAttendance(targetDate));
    }
  };

  useEffect(() => {
    loadStudents(globalDate);

    const handleSync = () => {
      loadStudents(globalDate);
    };

    window.addEventListener('edusuccess_attendance_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('edusuccess_attendance_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [globalDate]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest('.student-dropdown-wrap')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [department, semester, riskLevel, section, searchQuery, globalSearchQuery, rowsPerPage]);

  // Filter Options
  const departmentOptions = [
    'All Departments',
    'Computer Engg.',
    'Information Tech.',
    'Electronics Engg.',
    'Mechanical Engg.',
    'Civil Engg.'
  ];

  const semesterOptions = [
    'All Semesters',
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  const riskOptions = ['All Risk Levels', 'High Risk', 'Medium Risk', 'Low Risk'];
  const sectionOptions = ['All Sections', 'Section A', 'Section B', 'Section C', 'Section D'];

  // Filtering
  const filteredStudents = useMemo(() => {
    const effectiveQuery = (searchQuery || globalSearchQuery || '').trim().toLowerCase();
    return students.filter((s) => {
      if (department !== 'All Departments' && s.dept !== department) return false;
      if (semester !== 'All Semesters') {
        const semNum = semester.replace('Semester ', '').trim();
        if (`${s.semester}` !== semNum && `${s.semester}` !== semester) return false;
      }
      if (riskLevel !== 'All Risk Levels') {
        const target = riskLevel.replace(' Risk', '').toLowerCase();
        if (s.riskLevel.toLowerCase() !== target) return false;
      }
      if (section !== 'All Sections' && s.section !== section) return false;

      if (effectiveQuery) {
        const match =
          s.name.toLowerCase().includes(effectiveQuery) ||
          s.id.toLowerCase().includes(effectiveQuery) ||
          s.rollNo.toLowerCase().includes(effectiveQuery) ||
          s.dept.toLowerCase().includes(effectiveQuery) ||
          s.section.toLowerCase().includes(effectiveQuery);
        if (!match) return false;
      }

      return true;
    });
  }, [students, department, semester, riskLevel, section, searchQuery, globalSearchQuery]);

  // Paginated Slicing (Strict 10 items per page)
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage, rowsPerPage]);

  // Handle Add Student Submit
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      notify('Please enter student name');
      return;
    }

    const payload = {
      name: addForm.name,
      rollNo: addForm.rollNo || `CE20210${students.length + 1}`,
      dept: addForm.dept,
      semester: parseInt(addForm.semester, 10) || 4,
      section: addForm.section,
      attendancePct: parseFloat(addForm.attendancePct) || 80,
      cgpa: parseFloat(addForm.cgpa) || 6.5,
      backlogs: parseInt(addForm.backlogs, 10) || 0
    };

    try {
      await studentService.create(payload);
    } catch (err) {
      console.warn('Backend call failed, updating local state only:', err);
    }

    // Local instant update
    const newStudent = {
      id: `STU${1001 + students.length}`,
      name: payload.name,
      rollNo: payload.rollNo,
      dept: payload.dept,
      semester: payload.semester,
      section: payload.section,
      subject: payload.subject || 'Data Structures',
      riskScore: payload.attendancePct < 60 || payload.cgpa < 4 ? '85%' : payload.cgpa < 5.5 ? '50%' : '15%',
      riskLevel: payload.attendancePct < 60 || payload.cgpa < 4 ? 'High' : payload.cgpa < 5.5 ? 'Medium' : 'Low',
      attendance: `${payload.attendancePct}%`,
      cgpa: `${payload.cgpa}`,
      marks: Math.round(payload.cgpa * 9.5),
      backlogs: `${payload.backlogs}`,
      initials: payload.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      factors: payload.backlogs > 0 ? `${payload.backlogs} Backlog(s)` : 'Stable',
      style: 'Visual Learner',
      income: '₹1,00,000 - ₹2,00,000'
    };

    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      try {
        localStorage.setItem('edusuccess_students_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setShowAddModal(false);
    setAddForm({
      name: '',
      rollNo: '',
      dept: 'Computer Engg.',
      semester: '4',
      section: 'Section A',
      attendancePct: '85',
      cgpa: '7.5',
      backlogs: '0'
    });
    notify(`Student "${newStudent.name}" (${newStudent.rollNo}) added to ${newStudent.section}!`);
  };

  // Delete Student
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}" (${studentId})?`)) {
      return;
    }

    try {
      await studentService.delete(studentId);
    } catch (err) {
      console.warn('Backend delete sync:', err);
    }

    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      try {
        localStorage.setItem('edusuccess_students_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedStudentForAnalysis(null);
    notify(`Student "${studentName}" (${studentId}) has been deleted.`);
  };

  // Handle Excel File Selected
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '-' });

        if (jsonData.length < 2) {
          setImportError('Excel sheet is empty or has no data rows.');
          return;
        }

        const headers = jsonData[0].map((h) => (h ? String(h).trim().toLowerCase() : ''));
        const rows = jsonData.slice(1).filter((r) => r.some((c) => c !== '' && c !== '-'));

        // Column mapping with dash '-' fallback
        const parsed = rows.map((row, idx) => {
          const getVal = (possibleNames) => {
            for (let name of possibleNames) {
              const colIdx = headers.indexOf(name.toLowerCase());
              if (colIdx !== -1 && row[colIdx] !== undefined && row[colIdx] !== '' && row[colIdx] !== null) {
                return String(row[colIdx]).trim();
              }
            }
            return '-';
          };

          const name = getVal(['student name', 'name', 'full name', 'student_name']);
          const rollNo = getVal(['enrollment no.', 'enrollment no', 'enrollment', 'enrollment_no', 'roll no.', 'roll no', 'roll_no', 'roll number', 'rollno', 'roll', 'student id', 'id']);
          const dept = getVal(['department', 'dept', 'branch', 'course']);
          const sem = getVal(['semester', 'sem']);
          const sec = getVal(['section', 'sec', 'class']) === '-' ? 'Section A' : getVal(['section', 'sec', 'class']);
          const attendance = getVal(['attendance', 'attendance %', 'attendance_pct', 'attendance percentage']);
          const cgpa = getVal(['cgpa', 'gpa', 'academic cgpa']);
          const marks = getVal(['marks', 'score', 'percentage', 'academic marks']);
          const backlogs = getVal(['backlogs', 'backlog', 'active backlogs']);
          const subject = getVal(['subject', 'course', 'subject name', 'course name']);

          const effectiveId = `STU${1001 + students.length + idx}`;
          const effectiveRoll = rollNo !== '-' ? rollNo : effectiveId;

          return {
            id: effectiveId,
            name,
            rollNo: effectiveRoll,
            dept: dept !== '-' ? dept : 'Computer Engg.',
            semester: sem !== '-' ? (typeof sem === 'string' ? parseInt(sem.replace('Semester ', ''), 10) || 4 : sem) : 4,
            section: sec,
            subject: subject !== '-' ? subject : 'Data Structures',
            attendance: attendance !== '-' && !attendance.endsWith('%') ? `${attendance}%` : (attendance !== '-' ? attendance : '80%'),
            cgpa: cgpa !== '-' ? cgpa : (marks !== '-' ? (parseFloat(marks) / 9.5).toFixed(2) : '6.0'),
            marks: marks !== '-' ? marks : (cgpa !== '-' ? Math.round(parseFloat(cgpa) * 9.5) : 60),
            backlogs: backlogs !== '-' ? backlogs : '0'
          };
        });

        setParsedPreview(parsed);
      } catch (err) {
        setImportError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Confirm Excel Import
  const handleConfirmImport = async () => {
    if (!parsedPreview.length) return;

    try {
      await studentService.bulkCreate(parsedPreview);
    } catch (err) {
      console.warn('Backend bulk import sync:', err);
    }

    const importedFormatted = parsedPreview.map((s, idx) => {
      const attNum = parseFloat(String(s.attendance).replace('%', '')) || 0;
      const cgpaNum = parseFloat(s.cgpa) || 6.0;
      const isHigh = attNum < 60 || (s.cgpa !== '-' && cgpaNum < 4.0);
      const isMed = attNum < 75 || (s.cgpa !== '-' && cgpaNum < 5.5);

      return {
        id: s.id || `STU_IMP_${Date.now()}_${idx + 1}`,
        rollNo: s.rollNo || `IMP2021${String(idx + 1).padStart(3, '0')}`,
        name: s.name || `Student ${idx + 1}`,
        dept: s.dept || 'Computer Engg.',
        semester: s.semester || '4',
        section: s.section || 'Section A',
        attendance: s.attendance ? (String(s.attendance).includes('%') ? s.attendance : `${s.attendance}%`) : '0%',
        cgpa: s.cgpa || '6.5',
        backlogs: s.backlogs !== undefined ? s.backlogs : '0',
        riskScore: isHigh ? '85%' : isMed ? '50%' : '15%',
        riskLevel: isHigh ? 'High' : isMed ? 'Medium' : 'Low',
        initials: s.name && s.name !== '-' ? s.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'ST',
        avatar: AVATAR_POOL[idx % AVATAR_POOL.length],
        factors: s.backlogs !== '-' && parseInt(s.backlogs, 10) > 0 ? `${s.backlogs} Backlog(s)` : 'Imported Record',
        style: 'Visual Learner',
        income: '₹1,00,000 - ₹2,00,000'
      };
    });

    if (importedFormatted.length >= 40) {
      setStudents(importedFormatted);
      try {
        localStorage.setItem('edusuccess_custom_students', JSON.stringify(importedFormatted));
      } catch (e) {}
    } else {
      setStudents((prev) => {
        const existingRolls = new Set(prev.map((s) => s.rollNo));
        const nonDuplicate = importedFormatted.filter((s) => !existingRolls.has(s.rollNo));
        const updated = [...nonDuplicate, ...prev];
        try {
          localStorage.setItem('edusuccess_custom_students', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }

    setShowImportModal(false);
    setImportFile(null);
    setParsedPreview([]);
    notify(`Successfully imported and synchronized all ${importedFormatted.length} student records from Excel!`);
  };

  // Download Sample Excel Template
  const handleDownloadSample = () => {
    const sampleData = [
      {
        'Student Name': 'Rohan Joshi',
        'Roll No.': 'CE2021010',
        'Department': 'Computer Engg.',
        'Semester': '4',
        'Section': 'Section A',
        'Attendance': '85%',
        'CGPA': '7.8',
        'Backlogs': '0'
      },
      {
        'Student Name': 'Priya Nair',
        'Roll No.': 'IT2021011',
        'Department': 'Information Tech.',
        'Semester': '6',
        'Section': 'Section B',
        'Attendance': '42%',
        'CGPA': '3.9',
        'Backlogs': '2'
      },
      {
        'Student Name': 'Aditya Roy',
        'Roll No.': '-',
        'Department': 'Mechanical Engg.',
        'Semester': '-',
        'Section': 'Section A',
        'Attendance': '78%',
        'CGPA': '-',
        'Backlogs': '1'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students_Template');
    XLSX.writeFile(wb, 'EduSuccess_Students_Sample_Template.xlsx');
    notify('Sample Excel template downloaded.');
  };

  // Export to Excel
  const handleExportStudents = () => {
    const exportData = filteredStudents.map((s) => ({
      'Enrollment No.': s.rollNo,
      'Student Name': s.name,
      'Department': s.dept,
      'Semester': s.semester,
      'Section': s.section,
      'Risk Score': s.riskScore,
      'Risk Level': s.riskLevel,
      'Attendance': s.attendance,
      'CGPA': s.cgpa,
      'Backlogs': s.backlogs,
      'Main Risk Factors': s.factors
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students_List');
    XLSX.writeFile(wb, `EduSuccess_Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
    notify(`Exported ${filteredStudents.length} student records to Excel.`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartment('All Departments');
    setSemester('All Semesters');
    setRiskLevel('All Risk Levels');
    setSection('All Sections');
    notify('All filters reset to default.');
  };

  // Calculations for bottom KPI cards
  const totalCount = students.length;
  const secACount = students.filter((s) => s.section === 'Section A').length;
  const secBCount = students.filter((s) => s.section === 'Section B').length;
  const secCCount = students.filter((s) => s.section === 'Section C').length;
  const secDCount = students.filter((s) => s.section === 'Section D').length;
  const atRiskCount = students.filter((s) => s.riskLevel === 'High').length;
  const validCgpas = students.map((s) => parseFloat(s.cgpa)).filter((n) => !isNaN(n));
  const avgCgpa = validCgpas.length > 0 ? (validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2) : '6.00';

  return (
    <div className="students-page">
      {/* Header */}
      <div className="student-head">
        <div>
          <h1>
            <Users /> Students
          </h1>
          <p>Dashboard　›　Students</p>
          <small>Manage and view all {students.length} student records in real time. Add new students or import directly from Excel.</small>
        </div>
        <span>
          <button onClick={() => setShowAddModal(true)}>＋ Add Student</button>
          <button onClick={() => setShowImportModal(true)}>▣ Import from Excel</button>
          <button onClick={handleExportStudents}>⇩ Export</button>
        </span>
      </div>

      {/* Main Student Box */}
      <section className="student-box">
        {/* Filters Bar with Interactive Dropdowns */}
        <div className="student-filters">
          <label>
            <Search />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll no., department, or section..."
            />
          </label>

          {/* Department Dropdown */}
          <div className="student-dropdown-wrap">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'dept' ? null : 'dept')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {department} <ChevronDown style={{ width: 14 }} />
            </button>
            {openDropdown === 'dept' && (
              <div className="drop" style={{ minWidth: '180px' }}>
                <b>Select Department</b>
                {departmentOptions.map((opt) => (
                  <button
                    key={opt}
                    style={{ fontWeight: department === opt ? '700' : '400', color: department === opt ? '#2544db' : '' }}
                    onClick={() => {
                      setDepartment(opt);
                      setOpenDropdown(null);
                      notify(`Department filter: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Semester Dropdown */}
          <div className="student-dropdown-wrap">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sem' ? null : 'sem')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {semester} <ChevronDown style={{ width: 14 }} />
            </button>
            {openDropdown === 'sem' && (
              <div className="drop" style={{ minWidth: '160px' }}>
                <b>Select Semester</b>
                {semesterOptions.map((opt) => (
                  <button
                    key={opt}
                    style={{ fontWeight: semester === opt ? '700' : '400', color: semester === opt ? '#2544db' : '' }}
                    onClick={() => {
                      setSemester(opt);
                      setOpenDropdown(null);
                      notify(`Semester filter: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Risk Level Dropdown */}
          <div className="student-dropdown-wrap">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'risk' ? null : 'risk')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {riskLevel} <ChevronDown style={{ width: 14 }} />
            </button>
            {openDropdown === 'risk' && (
              <div className="drop" style={{ minWidth: '160px' }}>
                <b>Select Risk Level</b>
                {riskOptions.map((opt) => (
                  <button
                    key={opt}
                    style={{ fontWeight: riskLevel === opt ? '700' : '400', color: riskLevel === opt ? '#2544db' : '' }}
                    onClick={() => {
                      setRiskLevel(opt);
                      setOpenDropdown(null);
                      notify(`Risk filter: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Dropdown (Replacing Status) */}
          <div className="student-dropdown-wrap">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'sec' ? null : 'sec')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {section} <ChevronDown style={{ width: 14 }} />
            </button>
            {openDropdown === 'sec' && (
              <div className="drop" style={{ minWidth: '150px' }}>
                <b>Select Section</b>
                {sectionOptions.map((opt) => (
                  <button
                    key={opt}
                    style={{ fontWeight: section === opt ? '700' : '400', color: section === opt ? '#2544db' : '' }}
                    onClick={() => {
                      setSection(opt);
                      setOpenDropdown(null);
                      notify(`Section filter: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => notify(`Applied active filters. Found ${filteredStudents.length} records.`)}>
            ⚱ Filters
          </button>
          <a onClick={handleClearFilters}>Clear All</a>
        </div>

        {/* Students Data Table (Section column replacing Status) */}
        <table>
          <thead>
            <tr>
              {[
                '□',
                'Enrollment No.',
                'Student Name',
                'Department',
                'Semester',
                'Risk Score',
                'Risk Level',
                'Attendance',
                'CGPA',
                'Backlogs',
                'Section',
                'Action'
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '35px', color: '#64748b' }}>
                  No student records matched your current filters.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s) => (
                <tr key={s.id}>
                  <td>□</td>
                  <td><b>{s.rollNo}</b></td>
                  <td>
                    <span className="person">{s.initials}</span>
                    {s.name}
                  </td>
                  <td>{s.dept}</td>
                  <td>{s.semester !== '-' ? `Semester ${s.semester}` : '-'}</td>
                  <td>
                    <b>{s.riskScore}</b>
                    <em className="score">
                      <i style={{ width: s.riskScore !== '-' ? s.riskScore : '0%' }} />
                    </em>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: s.riskLevel === 'High' ? '#fff1f2' : s.riskLevel === 'Medium' ? '#fffbeb' : '#ecfdf5',
                        color: s.riskLevel === 'High' ? '#be123c' : s.riskLevel === 'Medium' ? '#b45309' : '#047857',
                        border: `1px solid ${s.riskLevel === 'High' ? '#fecdd3' : s.riskLevel === 'Medium' ? '#fde68a' : '#a7f3d0'}`
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: s.riskLevel === 'High' ? '#e11d48' : s.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'
                        }}
                      />
                      {s.riskLevel} Risk
                    </span>
                  </td>
                  <td>{s.attendance}</td>
                  <td>{s.cgpa}</td>
                  <td>{s.backlogs}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#e0e7ff',
                        color: '#3730a3',
                        fontWeight: 600,
                        fontSize: 11
                      }}
                    >
                      {s.section}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view"
                      title="View Student Analysis"
                      onClick={() => {
                        setSelectedStudentForAnalysis(s);
                        setActivePillarTab(null);
                      }}
                    >
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Interactive Working Pagination */}
        <footer>
          Showing {filteredStudents.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * rowsPerPage, filteredStudents.length)} of {filteredStudents.length} students{' '}
          <span>
            Rows per page:　
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              style={{
                border: '1px solid #dce4f5',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '12px',
                color: '#172555',
                cursor: 'pointer'
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            　
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={currentPage === pageNum ? 'active' : ''}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              ›
            </button>
          </span>
        </footer>
      </section>

      {/* 7 Bottom Dynamic KPI Stat Cards (Including Sections A, B, C, D) */}
      <div className="student-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
        {[
          ['Total Students', `${totalCount}`, '100% of total enrollment', 'purple'],
          ['Section A', `${secACount}`, `${Math.round((secACount / (totalCount || 1)) * 100)}% of cohort`, 'green'],
          ['Section B', `${secBCount}`, `${Math.round((secBCount / (totalCount || 1)) * 100)}% of cohort`, 'amber'],
          ['Section C', `${secCCount}`, `${Math.round((secCCount / (totalCount || 1)) * 100)}% of cohort`, 'blue'],
          ['Section D', `${secDCount}`, `${Math.round((secDCount / (totalCount || 1)) * 100)}% of cohort`, 'purple'],
          ['At Risk Students', `${atRiskCount}`, `${Math.round((atRiskCount / (totalCount || 1)) * 100)}% of total students`, 'red'],
          ['Avg. CGPA', `${avgCgpa}`, 'Across all students', 'blue']
        ].map((x) => (
          <section className={x[3]} key={x[0]}>
            <b>{x[0]}</b>
            <h2>{x[1]}</h2>
            <small>{x[2]}</small>
          </section>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD STUDENT MODAL (With Section Selector) */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="att-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="att-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(18, 38, 90, 0.22)',
              overflow: 'hidden'
            }}
          >
            <div
              className="att-modal-head"
              style={{
                background: 'linear-gradient(135deg, #f8faff, #edf3ff)',
                padding: '20px 24px',
                borderBottom: '1px solid #dbe6fa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="att-icon-badge"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '10px',
                    background: '#6255ed',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(98,85,237,0.3)'
                  }}
                >
                  <UserPlus style={{ width: 20 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: '#0c1a4e', fontWeight: 700 }}>
                    Add New Student Record
                  </h3>
                  <small style={{ color: '#596997', fontSize: 12 }}>
                    Fill details below to add directly into active student database
                  </small>
                </div>
              </div>
              <button
                className="att-close-btn"
                onClick={() => setShowAddModal(false)}
                style={{
                  border: '1px solid #dce4f5',
                  background: '#fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: 16 }} />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit}>
              <div
                className="att-modal-body"
                style={{
                  padding: '22px 24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  background: '#fff'
                }}
              >
                <div className="att-input-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Full Student Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Enrollment / Roll No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CE2021009"
                    value={addForm.rollNo}
                    onChange={(e) => setAddForm({ ...addForm, rollNo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Department
                  </label>
                  <select
                    value={addForm.dept}
                    onChange={(e) => setAddForm({ ...addForm, dept: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      background: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="Computer Engg.">Computer Engg.</option>
                    <option value="Information Tech.">Information Tech.</option>
                    <option value="Electronics Engg.">Electronics Engg.</option>
                    <option value="Mechanical Engg.">Mechanical Engg.</option>
                    <option value="Civil Engg.">Civil Engg.</option>
                  </select>
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Semester
                  </label>
                  <select
                    value={addForm.semester}
                    onChange={(e) => setAddForm({ ...addForm, semester: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      background: '#fff',
                      outline: 'none'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Section
                  </label>
                  <select
                    value={addForm.section}
                    onChange={(e) => setAddForm({ ...addForm, section: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      background: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                  </select>
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Attendance (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={addForm.attendancePct}
                    onChange={(e) => setAddForm({ ...addForm, attendancePct: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="att-input-group">
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Current CGPA (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={addForm.cgpa}
                    onChange={(e) => setAddForm({ ...addForm, cgpa: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="att-input-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#172555' }}>
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={addForm.backlogs}
                    onChange={(e) => setAddForm({ ...addForm, backlogs: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div
                className="att-modal-foot"
                style={{
                  padding: '16px 24px',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}
              >
                <button
                  type="button"
                  className="att-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="att-btn-primary"
                  style={{
                    border: 0,
                    background: 'linear-gradient(135deg, #6255ed, #3b82f6)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(98,85,237,0.35)'
                  }}
                >
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. IMPORT EXCEL MODAL */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="att-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div
            className="att-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', borderRadius: '14px', overflow: 'hidden' }}
          >
            <div
              className="att-modal-head"
              style={{
                background: 'linear-gradient(135deg, #f0fdf4, #e6f9ed)',
                padding: '20px 24px',
                borderBottom: '1px solid #bbf7d0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="att-icon-badge"
                  style={{ width: 40, height: 40, background: '#10b981', color: '#fff', borderColor: '#059669' }}
                >
                  <FileSpreadsheet style={{ width: 20 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: '#064e3b', fontWeight: 700 }}>
                    Import Students from Excel (.xlsx / .csv)
                  </h3>
                  <small style={{ color: '#047857', fontSize: 12 }}>
                    Upload file. Missing columns will automatically default to <b>"-"</b>.
                  </small>
                </div>
              </div>
              <button
                className="att-close-btn"
                onClick={() => setShowImportModal(false)}
                style={{
                  border: '1px solid #dce4f5',
                  background: '#fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: 16 }} />
              </button>
            </div>

            <div className="att-modal-body" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Dropzone */}
              <div
                className="att-file-drop"
                style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#f8fbff',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <FileSpreadsheet style={{ width: 38, height: 38, color: '#3b82f6', margin: '0 auto 8px' }} />
                <b style={{ display: 'block', fontSize: 14, color: '#1e293b' }}>
                  {importFile ? importFile.name : 'Click to browse or drag & drop Excel / CSV file'}
                </b>
                <small style={{ color: '#64748b', fontSize: 12 }}>
                  Supports .xlsx, .xls, .csv (Headers: Student Name, Roll No., Department, Semester, Section, Attendance, CGPA, Backlogs)
                </small>
              </div>

              {importError && (
                <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: 12 }}>
                  ⚠ {importError}
                </div>
              )}

              {/* Sample Template helper */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: 12
                }}
              >
                <span>
                  💡 <b>Need a template?</b> Download the sample format with all columns.
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#2563eb',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 11
                  }}
                >
                  Download Sample Template
                </button>
              </div>

              {/* Live Preview Table if parsed */}
              {parsedPreview.length > 0 && (
                <div style={{ marginTop: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <b style={{ fontSize: 13, color: '#1e293b' }}>
                      Preview: Found {parsedPreview.length} Student Records
                    </b>
                    <small style={{ color: '#10b981', fontWeight: 600 }}>✓ Missing values set to "-"</small>
                  </div>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', color: '#475569' }}>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Roll No.</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Dept</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Sem</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Section</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Att.</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>CGPA</th>
                          <th style={{ padding: '8px', textAlign: 'left' }}>Backlogs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedPreview.slice(0, 5).map((row, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px' }}>{row.name}</td>
                            <td style={{ padding: '8px' }}>{row.rollNo}</td>
                            <td style={{ padding: '8px' }}>{row.dept}</td>
                            <td style={{ padding: '8px' }}>{row.semester}</td>
                            <td style={{ padding: '8px' }}>{row.section}</td>
                            <td style={{ padding: '8px' }}>{row.attendance}</td>
                            <td style={{ padding: '8px' }}>{row.cgpa}</td>
                            <td style={{ padding: '8px' }}>{row.backlogs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedPreview.length > 5 && (
                    <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>
                      + {parsedPreview.length - 5} more rows ready to import
                    </small>
                  )}
                </div>
              )}
            </div>

            <div
              className="att-modal-foot"
              style={{
                padding: '16px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}
            >
              <button
                type="button"
                className="att-btn-secondary"
                onClick={() => {
                  setShowImportModal(false);
                  setParsedPreview([]);
                  setImportFile(null);
                }}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="att-btn-primary"
                disabled={parsedPreview.length === 0}
                onClick={handleConfirmImport}
                style={{
                  border: 0,
                  background: parsedPreview.length === 0 ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  cursor: parsedPreview.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Import {parsedPreview.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 7-PILLAR AI MULTI-DIMENSIONAL STUDENT EVALUATION MODAL */}
      {/* ========================================================================= */}
      {selectedStudentForAnalysis && currentDeepProfile && (
        <div className="att-modal-overlay" onClick={() => setSelectedStudentForAnalysis(null)}>
          <div
            className="att-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '740px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}
          >
            {/* Header */}
            <div
              className="att-modal-head"
              style={{
                padding: '18px 24px',
                background: 'linear-gradient(135deg, #f8faff, #edf3ff)',
                borderBottom: '1px solid #dbe6fa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedStudentForAnalysis.avatar}
                  alt={selectedStudentForAnalysis.name}
                  style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #5247e6' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 800 }}>
                    {selectedStudentForAnalysis.name}{' '}
                    <span style={{ fontSize: 13, color: '#5247e6', fontWeight: 700 }}>
                      ({selectedStudentForAnalysis.rollNo})
                    </span>
                  </h3>
                  <small style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>
                    {selectedStudentForAnalysis.dept} • Semester {selectedStudentForAnalysis.semester} • {selectedStudentForAnalysis.section}
                  </small>
                </div>
              </div>
              <button
                className="att-close-btn"
                onClick={() => setSelectedStudentForAnalysis(null)}
                style={{
                  border: '1px solid #dce4f5',
                  background: '#fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: 16 }} />
              </button>
            </div>

            {/* Body */}
            <div
              className="att-modal-body"
              style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Top Synthesized Dropout Risk Banner */}
              {/* ========================================================
                  1. REFINED ENTERPRISE AI RISK TELEMETRY BAR
              ======================================================== */}
              {(() => {
                const plan = selectedStudentForAnalysis ? studentAiPlans[selectedStudentForAnalysis.id] : null;
                const currentScore = plan?.aiCalculatedRiskScore !== undefined
                  ? `${plan.aiCalculatedRiskScore}%`
                  : currentDeepProfile.aiSynthesis.dropoutProbability;
                const currentScoreNum = plan?.aiCalculatedRiskScore !== undefined
                  ? plan.aiCalculatedRiskScore
                  : (parseInt(currentScore, 10) || 45);
                const currentLevel = plan?.aiRiskLevel || currentDeepProfile.aiSynthesis.riskLevel;

                const isHigh = currentLevel === 'High';
                const isMed = currentLevel === 'Medium';

                const badgeBg = isHigh ? '#fff1f2' : isMed ? '#fffbeb' : '#ecfdf5';
                const badgeColor = isHigh ? '#be123c' : isMed ? '#b45309' : '#047857';
                const badgeBorder = isHigh ? '#fecdd3' : isMed ? '#fde68a' : '#a7f3d0';
                const dotColor = isHigh ? '#e11d48' : isMed ? '#f59e0b' : '#10b981';
                const trackGradient = isHigh
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : isMed
                  ? 'linear-gradient(90deg, #10b981, #f59e0b)'
                  : 'linear-gradient(90deg, #3b82f6, #10b981)';

                return (
                  <div
                    style={{
                      padding: '14px 18px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: badgeBg,
                            border: `1px solid ${badgeBorder}`,
                            color: dotColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <TrendingUp style={{ width: 18, height: 18 }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748b' }}>
                            AI Dropout Risk Telemetry
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 1 }}>
                            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                              {currentScore}
                            </span>
                            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                              Dropout Probability
                            </span>
                            {plan?.aiConfidence && (
                              <span style={{ fontSize: 10, background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                                {plan.aiConfidence} Confidence
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Attractive Multi-Tier Risk Level Indicator */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 14px',
                          borderRadius: 10,
                          background: isHigh
                            ? 'linear-gradient(135deg, #fff1f2, #ffe4e6)'
                            : isMed
                            ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
                            : 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                          border: isHigh
                            ? '1.5px solid #f43f5e'
                            : isMed
                            ? '1.5px solid #f59e0b'
                            : '1.5px solid #10b981',
                          boxShadow: isHigh
                            ? '0 2px 10px rgba(244, 63, 94, 0.15)'
                            : isMed
                            ? '0 2px 10px rgba(245, 158, 11, 0.15)'
                            : '0 2px 10px rgba(16, 185, 129, 0.15)'
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            background: isHigh ? '#e11d48' : isMed ? '#d97706' : '#059669',
                            color: '#ffffff'
                          }}
                        >
                          {isHigh ? (
                            <AlertTriangle style={{ width: 12, height: 12 }} />
                          ) : isMed ? (
                            <Clock style={{ width: 12, height: 12 }} />
                          ) : (
                            <CheckCircle2 style={{ width: 12, height: 12 }} />
                          )}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                          <span
                            style={{
                              fontSize: 9,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              fontWeight: 700,
                              color: isHigh ? '#be123c' : isMed ? '#b45309' : '#047857'
                            }}
                          >
                            {isHigh ? 'Urgent Alert' : isMed ? 'Watchlist' : 'Optimal'}
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 900,
                              color: isHigh ? '#881337' : isMed ? '#78350f' : '#064e3b',
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {currentLevel} Risk Tier
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sleek Probability Progress Track */}
                    <div style={{ width: '100%', height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(8, currentScoreNum))}%`,
                          height: '100%',
                          background: trackGradient,
                          borderRadius: 4,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* ========================================================
                  2. AI RETENTION PLAN TRIGGER BAR
              ======================================================== */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #f8faff, #f1f5f9)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Sparkles style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
                      AI Retention &amp; Remediation Plan
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      Generates personalized 3-week milestone milestones with faculty &amp; parent actions.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={geminiLoading}
                  onClick={handleGenerateLiveGeminiPlan}
                  className="btn-primary-purple"
                  style={{ padding: '8px 18px', fontSize: 12, fontWeight: 700, gap: 6 }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} />
                  <span>{geminiLoading ? 'AI Calculating Plan...' : '✨ Generate AI Retention Plan'}</span>
                </button>
              </div>

              {/* ========================================================
                  3. STRUCTURED MODERN AI RETENTION DOSSIER
              ======================================================== */}
              {selectedStudentForAnalysis && studentAiPlans[selectedStudentForAnalysis.id] && (() => {
                const plan = studentAiPlans[selectedStudentForAnalysis.id];
                return (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    padding: 18,
                    borderRadius: 14,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: '#f5f3ff',
                          color: '#6d28d9',
                          border: '1px solid #ddd6fe',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700
                        }}>
                          <Sparkles style={{ width: 12, height: 12 }} />
                          {plan.provider || 'AI Retention Engine'}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
                          Personalized Retention Dossier for {selectedStudentForAnalysis.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setStudentAiPlans((prev) => {
                            const copy = { ...prev };
                            delete copy[selectedStudentForAnalysis.id];
                            return copy;
                          })
                        }
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                      >
                        ✕ Dismiss
                      </button>
                    </div>

                    {/* Section 1: Diagnostic Assessment & Root Causes */}
                    <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <AlertCircle style={{ width: 14, height: 14, color: '#6366f1' }} />
                        <span>AI Diagnostic Assessment &amp; Root Cause:</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.55 }}>
                        {plan.executiveSummary || plan.planMarkdown}
                      </div>

                      {plan.rootCauses && Array.isArray(plan.rootCauses) && plan.rootCauses.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {plan.rootCauses.map((rc, rIdx) => (
                            <span key={rIdx} style={{ fontSize: 11, background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: 6, color: '#475569', fontWeight: 600 }}>
                              • {rc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 2: 3-Week Remedial Milestone Roadmap */}
                    {plan.weeklyRoadmap && Array.isArray(plan.weeklyRoadmap) && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Calendar style={{ width: 14, height: 14, color: '#4f46e5' }} />
                          <span>3-Week Remedial Milestone Roadmap:</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
                          {plan.weeklyRoadmap.map((w, wIdx) => (
                            <div
                              key={wIdx}
                              style={{
                                padding: 12,
                                borderRadius: 10,
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 11, fontWeight: 900, color: '#4338ca', background: '#e0e7ff', padding: '2px 7px', borderRadius: 4 }}>
                                  {w.week}
                                </span>
                                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                                  {w.focus}
                                </span>
                              </div>

                              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                                {w.title}
                              </div>

                              <ul style={{ margin: 0, paddingLeft: 16, color: '#334155', fontSize: 11.5, lineHeight: 1.5 }}>
                                {w.tasks && w.tasks.map((task, tIdx) => (
                                  <li key={tIdx}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 3: 2-Column Faculty Actions & Parent WhatsApp Brief */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                      {/* Left: Faculty Actions */}
                      {plan.facultyActionItems && (
                        <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <UserCheck style={{ width: 14, height: 14, color: '#7c3aed' }} />
                            <span>Faculty Advisor Directives:</span>
                          </div>
                          <ul style={{ margin: 0, paddingLeft: 16, color: '#334155', fontSize: 11.5, lineHeight: 1.55 }}>
                            {plan.facultyActionItems.map((fa, fIdx) => (
                              <li key={fIdx}>{fa}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Right: Parent WhatsApp Brief */}
                      {plan.parentAdvisoryTalkingPoints && (
                        <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <MessageSquare style={{ width: 14, height: 14, color: '#15803d' }} />
                              <span>Parent WhatsApp Communication Brief:</span>
                            </div>
                            <div style={{ fontSize: 11.5, color: '#14532d', lineHeight: 1.5, fontStyle: 'italic' }}>
                              "{plan.parentAdvisoryTalkingPoints}"
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText?.(plan.parentAdvisoryTalkingPoints);
                              notify('📱 WhatsApp advisory draft copied to clipboard!');
                            }}
                            style={{
                              marginTop: 8,
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '4px 10px',
                              borderRadius: 6,
                              background: '#ffffff',
                              border: '1px solid #86efac',
                              color: '#15803d',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Copy style={{ width: 12, height: 12 }} />
                            <span>Copy Message</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 7-PILLAR INTERACTIVE DIMENSION CARDS GRID */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0b153b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles style={{ width: 14, height: 14, color: '#5247e6' }} />
                  <span>7 Core AI Evaluation Pillars (Click any card to inspect details):</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                  {/* Pillar 1: Attendance */}
                  <div
                    onClick={() => handlePillarClick('attendance')}
                    className={`pillar-card ${activePillarTab === 'attendance' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#3b82f6' }}>
                      <Clock style={{ width: 15, height: 15 }} />
                      <span>1. Attendance Record</span>
                    </div>
                    <div className="pillar-card-val">
                      {selectedStudentForAnalysis.attendance}
                    </div>
                    <span className="pillar-card-sub" style={{ color: parseFloat(selectedStudentForAnalysis.attendance) < 75 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                      {parseFloat(selectedStudentForAnalysis.attendance) < 75 ? '⚠ Below mandatory 75% limit' : '✓ Good attendance'}
                    </span>
                  </div>

                  {/* Pillar 2: Academic CGPA */}
                  <div
                    onClick={() => handlePillarClick('cgpa')}
                    className={`pillar-card ${activePillarTab === 'cgpa' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#10b981' }}>
                      <GraduationCap style={{ width: 15, height: 15 }} />
                      <span>2. Academic CGPA</span>
                    </div>
                    <div className="pillar-card-val">
                      {selectedStudentForAnalysis.cgpa} <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>/ 10</span>
                    </div>
                    <span className="pillar-card-sub">
                      {currentDeepProfile.backlogsHistory.length > 0
                        ? `⚠ ${currentDeepProfile.backlogsHistory.length} Active Backlog(s)`
                        : '✓ 0 Active Backlogs'}
                    </span>
                  </div>

                  {/* Pillar 3: Assignment Submissions */}
                  <div
                    onClick={() => handlePillarClick('assignments')}
                    className={`pillar-card ${activePillarTab === 'assignments' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#8b5cf6' }}>
                      <FileCheck style={{ width: 15, height: 15 }} />
                      <span>3. Assignments</span>
                    </div>
                    <div className="pillar-card-val">
                      {currentDeepProfile.assignments.filter((a) => a.status === 'On-Time').length} / {currentDeepProfile.assignments.length}
                    </div>
                    <span className="pillar-card-sub">
                      {currentDeepProfile.assignments.some((a) => a.status.includes('Late') || a.status.includes('Missing'))
                        ? '⚠ Late / Missing Submissions'
                        : '✓ All Submissions On-Time'}
                    </span>
                  </div>

                  {/* Pillar 4: Backlogs History */}
                  <div
                    onClick={() => handlePillarClick('backlogs')}
                    className={`pillar-card ${activePillarTab === 'backlogs' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#ef4444' }}>
                      <AlertTriangle style={{ width: 15, height: 15 }} />
                      <span>4. Backlogs History</span>
                    </div>
                    <div className="pillar-card-val" style={{ color: currentDeepProfile.backlogsHistory.length > 0 ? '#dc2626' : '#059669' }}>
                      {currentDeepProfile.backlogsHistory.length} Active
                    </div>
                    <span className="pillar-card-sub">
                      {currentDeepProfile.backlogsHistory.length > 0 ? 'Remedial exam required' : 'Clear academic record'}
                    </span>
                  </div>

                  {/* Pillar 5: Co-Curricular Activities */}
                  <div
                    onClick={() => handlePillarClick('activities')}
                    className={`pillar-card ${activePillarTab === 'activities' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#6366f1' }}>
                      <Award style={{ width: 15, height: 15 }} />
                      <span>5. Co-Curricular</span>
                    </div>
                    <div className="pillar-card-val">
                      {currentDeepProfile.activities.length} Events Logged
                    </div>
                    <span className="pillar-card-sub" style={{ color: '#5247e6', fontWeight: 600 }}>
                      View verified certificates
                    </span>
                  </div>

                  {/* Pillar 6: Mentor Observations */}
                  <div
                    onClick={() => handlePillarClick('mentors')}
                    className={`pillar-card ${activePillarTab === 'mentors' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#7c3aed' }}>
                      <UserCheck style={{ width: 15, height: 15 }} />
                      <span>6. Mentor Observation</span>
                    </div>
                    <div className="pillar-card-val">
                      {currentDeepProfile.mentorLogs[0]?.engagementScore || 75}/100
                    </div>
                    <span className="pillar-card-sub">
                      Session logs &amp; feedback
                    </span>
                  </div>

                  {/* Pillar 7: Socio-Economic Context */}
                  <div
                    onClick={() => handlePillarClick('socio')}
                    className={`pillar-card ${activePillarTab === 'socio' ? 'active' : ''}`}
                  >
                    <div className="pillar-card-title" style={{ color: '#f59e0b' }}>
                      <HeartHandshake style={{ width: 15, height: 15 }} />
                      <span>7. Socio-Economic</span>
                    </div>
                    <div className="pillar-card-val" style={{ fontSize: 13 }}>
                      {currentDeepProfile.socioEconomic.income}
                    </div>
                    <span className="pillar-card-sub">
                      Commute &amp; welfare status
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  INTERACTIVE DETAILED DRILL-DOWN SUB-VIEW
              ======================================================== */}
              <div ref={drillDownRef}>
              {activePillarTab === null ? (
                <div style={{
                  padding: '22px 18px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: 12,
                  border: '1.5px dashed #cbd5e1'
                }}>
                  <Sparkles style={{ width: 24, height: 24, color: '#5247e6', margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', marginBottom: 2 }}>
                    Touch or Click Any Card Above to View Deep Breakdown
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>
                    Click on <strong>Attendance</strong> (subject-wise lectures), <strong>Academic CGPA</strong> (sem progression & exams), <strong>Assignments</strong> (submission dates), <strong>Backlogs</strong>, <strong>Co-Curricular</strong> (certificates), <strong>Mentor Observation</strong> (session notes), or <strong>Socio-Economic Context</strong>.
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                    <button
                      type="button"
                      onClick={() => setActivePillarTab(null)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      ✕ Close Breakdown
                    </button>
                  </div>
                {/* 1. Drill-Down: Subject-Wise Attendance */}
                {activePillarTab === 'attendance' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock style={{ width: 15, height: 15, color: '#3b82f6' }} />
                        <span>Subject-Wise Lecture Attendance Breakdown</span>
                      </h4>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6' }}>
                        Mandatory Limit: ≥75%
                      </span>
                    </div>

                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', background: '#ffffff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                          <th style={{ padding: '8px 10px' }}>Code</th>
                          <th style={{ padding: '8px 10px' }}>Subject Name</th>
                          <th style={{ padding: '8px 10px' }}>Faculty In-Charge</th>
                          <th style={{ padding: '8px 10px' }}>Lectures</th>
                          <th style={{ padding: '8px 10px' }}>Attendance %</th>
                          <th style={{ padding: '8px 10px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDeepProfile.subjectAttendance.map((sub, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#5247e6' }}>{sub.code}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0b153b' }}>{sub.name}</td>
                            <td style={{ padding: '8px 10px', color: '#64748b' }}>{sub.faculty}</td>
                            <td style={{ padding: '8px 10px' }}>{sub.attendedLectures}/{sub.totalLectures}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: sub.percentage < 60 ? '#dc2626' : sub.percentage < 75 ? '#d97706' : '#059669' }}>
                              {sub.percentage}%
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: sub.status === 'Critical' ? '#fef2f2' : sub.status === 'Warning' ? '#fffbeb' : '#ecfdf5',
                                color: sub.status === 'Critical' ? '#dc2626' : sub.status === 'Warning' ? '#d97706' : '#059669'
                              }}>
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. Drill-Down: Academic CGPA Progression */}
                {activePillarTab === 'cgpa' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <GraduationCap style={{ width: 15, height: 15, color: '#10b981' }} />
                        <span>Semester-Wise CGPA &amp; Mid/Final Exam Performance</span>
                      </h4>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>
                        Cumulative: {selectedStudentForAnalysis.cgpa} / 10
                      </span>
                    </div>

                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', background: '#ffffff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                          <th style={{ padding: '8px 10px' }}>Semester</th>
                          <th style={{ padding: '8px 10px' }}>CGPA</th>
                          <th style={{ padding: '8px 10px' }}>Mid-Term (/100)</th>
                          <th style={{ padding: '8px 10px' }}>Final Exam (/100)</th>
                          <th style={{ padding: '8px 10px' }}>Standing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDeepProfile.semesterProgression.map((sem, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0b153b' }}>{sem.semester}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: '#5247e6' }}>{sem.cgpa}</td>
                            <td style={{ padding: '8px 10px' }}>{sem.midExamMarks} / 100</td>
                            <td style={{ padding: '8px 10px' }}>{sem.finalExamMarks} / 100</td>
                            <td style={{ padding: '8px 10px', color: sem.status === 'Critical Risk' ? '#dc2626' : '#059669', fontWeight: 600 }}>
                              {sem.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. Drill-Down: Assignment Submissions */}
                {activePillarTab === 'assignments' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FileCheck style={{ width: 15, height: 15, color: '#8b5cf6' }} />
                        <span>Subject-Wise Assignment Submissions &amp; Deadlines</span>
                      </h4>
                    </div>

                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', background: '#ffffff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                          <th style={{ padding: '8px 10px' }}>Subject</th>
                          <th style={{ padding: '8px 10px' }}>Assignment Task</th>
                          <th style={{ padding: '8px 10px' }}>Due Date</th>
                          <th style={{ padding: '8px 10px' }}>Submitted On</th>
                          <th style={{ padding: '8px 10px' }}>Status</th>
                          <th style={{ padding: '8px 10px' }}>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDeepProfile.assignments.map((assign, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#5247e6' }}>{assign.subject}</td>
                            <td style={{ padding: '8px 10px', color: '#0b153b' }}>{assign.title}</td>
                            <td style={{ padding: '8px 10px', color: '#64748b' }}>{assign.dueDate}</td>
                            <td style={{ padding: '8px 10px', color: '#64748b' }}>{assign.submittedDate}</td>
                            <td style={{ padding: '8px 10px' }}>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                                background: assign.status === 'On-Time' ? '#ecfdf5' : '#fef2f2',
                                color: assign.status === 'On-Time' ? '#059669' : '#dc2626'
                              }}>
                                {assign.status}
                              </span>
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 800 }}>{assign.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 4. Drill-Down: Backlogs History */}
                {activePillarTab === 'backlogs' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle style={{ width: 15, height: 15, color: '#ef4444' }} />
                        <span>Semester-Wise Active &amp; Cleared Backlogs</span>
                      </h4>
                    </div>

                    {currentDeepProfile.backlogsHistory.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#059669', background: '#ecfdf5', borderRadius: 8, fontWeight: 600 }}>
                        ✓ Excellent! Student has 0 active backlogs in their academic history.
                      </div>
                    ) : (
                      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', background: '#ffffff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                            <th style={{ padding: '8px 10px' }}>Code</th>
                            <th style={{ padding: '8px 10px' }}>Backlog Subject</th>
                            <th style={{ padding: '8px 10px' }}>Semester</th>
                            <th style={{ padding: '8px 10px' }}>Status</th>
                            <th style={{ padding: '8px 10px' }}>Supplementary Schedule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentDeepProfile.backlogsHistory.map((backlog, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#dc2626' }}>{backlog.code}</td>
                              <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0b153b' }}>{backlog.subjectName}</td>
                              <td style={{ padding: '8px 10px' }}>{backlog.semester}</td>
                              <td style={{ padding: '8px 10px', color: '#dc2626', fontWeight: 700 }}>{backlog.status}</td>
                              <td style={{ padding: '8px 10px', color: '#475569' }}>{backlog.scheduledExam}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* 5. Drill-Down: Co-Curricular Activities & Certificate Preview */}
                {activePillarTab === 'activities' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Award style={{ width: 15, height: 15, color: '#6366f1' }} />
                        <span>Co-Curricular Achievements &amp; Verified Certificates</span>
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {currentDeepProfile.activities.map((act, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 14px',
                            background: '#ffffff',
                            borderRadius: 8,
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: '#0b153b', fontSize: 13 }}>{act.title}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {act.category} • {act.date} • <strong>{act.award}</strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setViewCertificateModal(act.certificate)}
                            className="btn-primary-purple"
                            style={{ padding: '5px 12px', fontSize: 11, gap: 4 }}
                          >
                            <Eye style={{ width: 13, height: 13 }} />
                            <span>View Certificate</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Drill-Down: Mentor Observations */}
                {activePillarTab === 'mentors' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <UserCheck style={{ width: 15, height: 15, color: '#7c3aed' }} />
                        <span>Faculty Mentor Session-Wise Observations &amp; Ratings</span>
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {currentDeepProfile.mentorLogs.map((log, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px 14px',
                            background: '#ffffff',
                            borderRadius: 8,
                            border: '1px solid #e2e8f0',
                            fontSize: 12
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, color: '#5247e6' }}>
                              Session #{log.sessionNo} ({log.date}) — Mentor: {log.mentorName}
                            </span>
                            <span style={{ fontWeight: 800, color: log.engagementScore >= 75 ? '#059669' : '#d97706' }}>
                              Rating: {log.engagementScore}/100
                            </span>
                          </div>
                          <div style={{ color: '#334155', margin: '4px 0' }}>
                            <strong>Observation:</strong> {log.remarks}
                          </div>
                          <div style={{ color: '#64748b', fontSize: 11 }}>
                            <strong>Action Assigned:</strong> {log.actionItem}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Drill-Down: Socio-Economic Context */}
                {activePillarTab === 'socio' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0b153b', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <HeartHandshake style={{ width: 15, height: 15, color: '#f59e0b' }} />
                        <span>Socio-Economic, Housing &amp; Welfare Diagnostic</span>
                      </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12 }}>
                      <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ color: '#64748b', fontSize: 11 }}>Annual Household Income:</div>
                        <div style={{ fontWeight: 800, color: '#0b153b', marginTop: 2 }}>{currentDeepProfile.socioEconomic.income}</div>
                      </div>

                      <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ color: '#64748b', fontSize: 11 }}>Living &amp; Transit Context:</div>
                        <div style={{ fontWeight: 800, color: '#0b153b', marginTop: 2 }}>{currentDeepProfile.socioEconomic.commute}</div>
                      </div>

                      <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ color: '#64748b', fontSize: 11 }}>Computing &amp; Digital Device Access:</div>
                        <div style={{ fontWeight: 800, color: '#0b153b', marginTop: 2 }}>{currentDeepProfile.socioEconomic.device}</div>
                      </div>

                      <div style={{ padding: '10px 12px', background: '#ffffff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ color: '#64748b', fontSize: 11 }}>Institutional Aid Status:</div>
                        <div style={{ fontWeight: 800, color: '#059669', marginTop: 2 }}>{currentDeepProfile.socioEconomic.financialAid}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}
              </div>
            </div>

            {/* Footer with Delete & WhatsApp Notice Option */}
            <div
              className="att-modal-foot"
              style={{
                padding: '16px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <button
                type="button"
                onClick={() => handleDeleteStudent(selectedStudentForAnalysis.id, selectedStudentForAnalysis.name)}
                style={{
                  border: '1px solid #fecdd3',
                  background: '#fff1f2',
                  color: '#e11d48',
                  borderRadius: '8px',
                  padding: '9px 15px',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 style={{ width: 15 }} /> Delete Student
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="att-btn-secondary"
                  onClick={() => setSelectedStudentForAnalysis(null)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '9px 16px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="att-btn-primary"
                  onClick={() => {
                    notify(`📱 Automated WhatsApp parent advisory notice dispatched for ${selectedStudentForAnalysis.name}!`);
                    setSelectedStudentForAnalysis(null);
                  }}
                  style={{
                    border: 0,
                    background: 'linear-gradient(135deg, #6255ed, #3b82f6)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send style={{ width: 14, height: 14 }} />
                  <span>Send Parent Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OFFICIAL VERIFIED CERTIFICATE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {viewCertificateModal && (
        <div className="bc-modal-backdrop" onClick={() => setViewCertificateModal(null)}>
          <div
            className="bc-cert-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 620, border: '4px double #d4af37' }}
          >
            <button onClick={() => setViewCertificateModal(null)} className="bc-cert-close">
              <X style={{ width: 18, height: 18 }} />
            </button>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#b45309', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                <Award style={{ width: 18, height: 18, color: '#d97706' }} />
                <span>Institutional Achievement Record</span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0b153b', margin: '10px 0 4px', letterSpacing: -0.5 }}>
                {viewCertificateModal.title}
              </h2>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Issued by: <strong>{viewCertificateModal.issuer}</strong>
              </div>
            </div>

            {/* Certificate Details */}
            <div style={{ background: '#fdfbf7', padding: 20, borderRadius: 10, border: '1px solid #fed7aa', margin: '14px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#78350f' }}>This is officially certified to acknowledge that:</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#5247e6', margin: '8px 0' }}>
                {viewCertificateModal.recipient}
              </div>
              <div style={{ fontSize: 12, color: '#451a03', fontWeight: 600 }}>
                Enrollment No: <strong>{viewCertificateModal.rollNo}</strong> • Department of <strong>{viewCertificateModal.dept}</strong>
              </div>
              <div style={{ fontSize: 11, color: '#9a3412', marginTop: 8 }}>
                Date of Concurrence: <strong>{viewCertificateModal.date}</strong> • Certificate ID: <strong>{viewCertificateModal.certId}</strong>
              </div>
            </div>

            {/* Blockchain Stamp & Hash */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 700 }}>
                <ShieldCheck style={{ width: 16, height: 16 }} />
                <span>On-Chain Authenticated Proof</span>
              </div>
              <div style={{ fontFamily: 'monospace', color: '#64748b' }}>
                {viewCertificateModal.hash}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setViewCertificateModal(null)}
                className="btn-primary-purple"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
