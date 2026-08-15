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
  HeartHandshake
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { studentService } from '../services/studentService';
import '../styles/attendance.css';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parseDateParams = (dateStr = '15 Aug 2026') => {
  const parts = dateStr.trim().split(' ');
  const day = parts.length === 3 ? parseInt(parts[0], 10) || 15 : 15;
  const mStr = parts.length === 3 ? parts[1] : 'Aug';
  const mIdx = MONTH_SHORT.indexOf(mStr) !== -1 ? MONTH_SHORT.indexOf(mStr) : 7;
  const year = parts.length === 3 ? parseInt(parts[2], 10) || 2026 : 2026;
  const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
  const monthKey = `${mStr} ${year}`;
  return { day, month: mIdx, monthStr: mStr, year, daysInMonth, monthKey };
};

const getStoredAttendanceHistory = () => {
  try {
    const saved = localStorage.getItem('edusuccess_attendance_history');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
};

const calculateStudentMonthlyAttendance = (student, targetDateStr = '15 Aug 2026') => {
  const { monthKey, daysInMonth } = parseDateParams(targetDateStr);
  const historyMap = getStoredAttendanceHistory();
  const studentKey = student.rollNo || student.id;
  const localHistory = historyMap[studentKey] || historyMap[student.rollNo] || historyMap[student.id] || {};
  const history = { ...(student.attendanceHistory || {}), ...localHistory };

  const historyEntries = Object.entries(history).filter(
    ([dKey, st]) => dKey.includes(monthKey) && st && st !== 'Not Marked' && st !== '-'
  );

  let attended = 0;
  historyEntries.forEach(([_, st]) => {
    if (st === 'Present') attended += 1;
    else if (st === 'Late') attended += 0.5;
  });

  const pct = daysInMonth > 0 ? parseFloat(((attended / daysInMonth) * 100).toFixed(1)) : 0;
  return { pct, attendedDays: attended, daysInMonth, markedCount: historyEntries.length };
};

const BASE_STUDENTS = [
  { id: 'STU1001', name: 'Rahul Patel', rollNo: 'CE2021001', dept: 'Computer Engg.', semester: 4, section: 'Section A', cgpa: '5.8', backlogs: '2', initials: 'RP', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', factors: '2 Backlog(s)', style: 'Visual Learner', income: '< ₹1,00,000' },
  { id: 'STU1002', name: 'Sneha Singh', rollNo: 'IT2021002', dept: 'Information Tech.', semester: 4, section: 'Section B', cgpa: '6.2', backlogs: '1', initials: 'SS', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', factors: '1 Backlog(s)', style: 'Auditory Learner', income: '₹1,00,000 - ₹2,00,000' },
  { id: 'STU1003', name: 'Aarav Mehta', rollNo: 'EE2021003', dept: 'Electronics Engg.', semester: 4, section: 'Section A', cgpa: '3.65', backlogs: '3', initials: 'AM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', factors: 'Low CGPA (<4.0), 3 Active Backlogs', style: 'Read/Write Learner', income: '> ₹2,00,000' },
  { id: 'STU1004', name: 'Pooja Sharma', rollNo: 'ME2021004', dept: 'Mechanical Engg.', semester: 4, section: 'Section B', cgpa: '3.89', backlogs: '2', initials: 'PS', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', factors: 'Low CGPA (<4.0), 2 Backlog(s)', style: 'Visual Learner', income: '< ₹1,00,000' },
  { id: 'STU1005', name: 'Karan Verma', rollNo: 'CE2021005', dept: 'Computer Engg.', semester: 6, section: 'Section A', cgpa: '4.12', backlogs: '3', initials: 'KV', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', factors: 'CGPA Below 5.5, 3 Active Backlogs', style: 'Kinesthetic Learner', income: '₹1,00,000 - ₹2,00,000' },
  { id: 'STU1006', name: 'Anjali Desai', rollNo: 'IT2021006', dept: 'Information Tech.', semester: 6, section: 'Section B', cgpa: '8.45', backlogs: '0', initials: 'AD', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', factors: 'Stable', style: 'Visual Learner', income: '> ₹2,00,000' },
  { id: 'STU1007', name: 'Vivek Yadav', rollNo: 'EE2021007', dept: 'Electronics Engg.', semester: 6, section: 'Section A', cgpa: '3.78', backlogs: '2', initials: 'VY', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', factors: 'Low CGPA (<4.0), 2 Backlog(s)', style: 'Auditory Learner', income: '₹1,00,000 - ₹2,00,000' },
  { id: 'STU1008', name: 'Neha Patel', rollNo: 'ME2021008', dept: 'Mechanical Engg.', semester: 6, section: 'Section B', cgpa: '3.42', backlogs: '4', initials: 'NP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', factors: 'Low CGPA (<4.0), 4 Active Backlogs', style: 'Kinesthetic Learner', income: '< ₹1,00,000' }
];

const getInitialStudentsWithLiveAttendance = (targetDate = '15 Aug 2026') => {
  return BASE_STUDENTS.map((s) => {
    const attStats = calculateStudentMonthlyAttendance(s, targetDate);
    const attPct = attStats.pct;
    let riskLevel = 'Low';
    let riskScore = '8%';
    if (attPct < 60 || parseFloat(s.cgpa) < 4.0 || parseInt(s.backlogs, 10) >= 3) {
      riskLevel = 'High';
      riskScore = '75%';
    } else if (attPct < 75 || parseFloat(s.cgpa) < 5.5 || parseInt(s.backlogs, 10) > 0) {
      riskLevel = 'Medium';
      riskScore = '45%';
    }
    return {
      ...s,
      riskLevel,
      riskScore,
      attendance: `${attPct}%`
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

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudentForAnalysis, setSelectedStudentForAnalysis] = useState(null);

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

  // Load from Backend API
  const loadStudents = async (targetDate = globalDate) => {
    try {
      const res = await studentService.getAll({ date: targetDate });
      if (res && res.data && res.data.length > 0) {
        const formatted = res.data.map((s) => {
          const attStats = calculateStudentMonthlyAttendance(s, targetDate);
          const attPct = attStats.pct;
          return {
            id: s.id,
            name: s.name || '-',
            rollNo: s.rollNo || '-',
            dept: s.dept || '-',
            semester: s.semester !== undefined ? s.semester : '-',
            section: s.section || s.attendance?.section || 'Section A',
            riskScore: s.calculatedRisk?.score || s.risk?.score || s.riskScore || '20%',
            riskLevel: s.calculatedRisk?.level || s.risk?.level || s.riskLevel || 'Low',
            attendance: `${attPct}%`,
            cgpa: s.academic?.cgpa !== undefined ? `${s.academic.cgpa}` : `${s.cgpa ?? '-'}`,
            backlogs: s.backlogs !== undefined ? `${s.backlogs}` : '0',
            initials: s.name && s.name !== '-' ? s.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'ST',
            avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            factors: s.calculatedRisk?.factors || s.risk?.factors || s.factors || 'None',
            style: s.behavior?.style || s.style || 'Visual Learner',
            income: s.socioEconomic?.income || s.income || '₹1,00,000 - ₹2,00,000'
          };
        });
        setStudents(formatted);
      }
    } catch (e) {
      console.warn('Using live persistent fallback for students:', e);
      setStudents(getInitialStudentsWithLiveAttendance(targetDate));
    }
  };

  useEffect(() => {
    loadStudents(globalDate);
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

    const importedFormatted = parsedPreview.map((s) => {
      const attNum = parseFloat(String(s.attendance).replace('%', '')) || 80;
      const cgpaNum = parseFloat(s.cgpa) || 6.0;
      const isHigh = attNum < 60 || (s.cgpa !== '-' && cgpaNum < 4.0);
      const isMed = attNum < 75 || (s.cgpa !== '-' && cgpaNum < 5.5);

      return {
        ...s,
        riskScore: isHigh ? '85%' : isMed ? '50%' : '15%',
        riskLevel: isHigh ? 'High' : isMed ? 'Medium' : 'Low',
        initials: s.name !== '-' ? s.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'ST',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        factors: s.backlogs !== '-' && parseInt(s.backlogs, 10) > 0 ? `${s.backlogs} Backlog(s)` : 'Imported Record',
        style: 'Visual Learner',
        income: '₹1,00,000 - ₹2,00,000'
      };
    });

    setStudents((prev) => {
      const updated = [...importedFormatted, ...prev];
      try {
        localStorage.setItem('edusuccess_students_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setShowImportModal(false);
    setImportFile(null);
    setParsedPreview([]);
    notify(`Successfully imported ${importedFormatted.length} students from Excel! (Roll numbers & all fields saved)`);
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
                    <mark className={s.riskLevel === 'High' ? '' : s.riskLevel === 'Medium' ? 'amber' : 'green'}>
                      {s.riskLevel}
                    </mark>
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
                      onClick={() => setSelectedStudentForAnalysis(s)}
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

      {/* 5 Bottom Dynamic KPI Stat Cards */}
      <div className="student-stats">
        {[
          ['Total Students', `${totalCount}`, '100% of total enrollment', 'purple'],
          ['Section A', `${secACount}`, `${Math.round((secACount / (totalCount || 1)) * 100)}% of total students`, 'green'],
          ['Section B', `${secBCount}`, `${Math.round((secBCount / (totalCount || 1)) * 100)}% of total students`, 'amber'],
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
      {/* 3. STUDENT ANALYSIS PROFILE MODAL */}
      {/* ========================================================================= */}
      {selectedStudentForAnalysis && (
        <div className="att-modal-overlay" onClick={() => setSelectedStudentForAnalysis(null)}>
          <div
            className="att-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', borderRadius: '14px', overflow: 'hidden' }}
          >
            {/* Header */}
            <div
              className="att-modal-head"
              style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, #f8faff, #edf3ff)',
                borderBottom: '1px solid #dbe6fa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedStudentForAnalysis.avatar}
                  alt={selectedStudentForAnalysis.name}
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 700 }}>
                    {selectedStudentForAnalysis.name}{' '}
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
                      ({selectedStudentForAnalysis.rollNo})
                    </span>
                  </h3>
                  <small style={{ color: '#64748b', fontSize: 12 }}>
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
              style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Risk Level Banner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background:
                    selectedStudentForAnalysis.riskLevel === 'High'
                      ? '#fff1f2'
                      : selectedStudentForAnalysis.riskLevel === 'Medium'
                      ? '#fffbeb'
                      : '#f0fdf4',
                  border: `1px solid ${
                    selectedStudentForAnalysis.riskLevel === 'High'
                      ? '#fecdd3'
                      : selectedStudentForAnalysis.riskLevel === 'Medium'
                      ? '#fde68a'
                      : '#bbf7d0'
                  }`
                }}
              >
                <div>
                  <small style={{ fontWeight: 600, color: '#475569', display: 'block' }}>
                    Dropout Risk Evaluation
                  </small>
                  <b
                    style={{
                      fontSize: 18,
                      color:
                        selectedStudentForAnalysis.riskLevel === 'High'
                          ? '#e11d48'
                          : selectedStudentForAnalysis.riskLevel === 'Medium'
                          ? '#d97706'
                          : '#16a34a'
                    }}
                  >
                    {selectedStudentForAnalysis.riskScore} — {selectedStudentForAnalysis.riskLevel} Risk
                  </b>
                </div>
                <mark
                  className={
                    selectedStudentForAnalysis.riskLevel === 'High'
                      ? ''
                      : selectedStudentForAnalysis.riskLevel === 'Medium'
                      ? 'amber'
                      : 'green'
                  }
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  {selectedStudentForAnalysis.riskLevel} Risk
                </mark>
              </div>

              {/* 4 Analytics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '4px' }}>
                    <Clock style={{ width: 16 }} />
                    <b style={{ fontSize: 12 }}>Attendance Record</b>
                  </div>
                  <h2 style={{ margin: '4px 0', fontSize: 20, color: '#1e293b' }}>
                    {selectedStudentForAnalysis.attendance}
                  </h2>
                  <small style={{ color: '#64748b' }}>
                    {parseFloat(selectedStudentForAnalysis.attendance) < 75 ? '⚠ Below mandatory 75% limit' : '✓ Good attendance'}
                  </small>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '4px' }}>
                    <GraduationCap style={{ width: 16 }} />
                    <b style={{ fontSize: 12 }}>Academic CGPA</b>
                  </div>
                  <h2 style={{ margin: '4px 0', fontSize: 20, color: '#1e293b' }}>
                    {selectedStudentForAnalysis.cgpa} <span style={{ fontSize: 12, color: '#64748b' }}>/ 10</span>
                  </h2>
                  <small style={{ color: '#64748b' }}>
                    {selectedStudentForAnalysis.backlogs !== '-' && parseInt(selectedStudentForAnalysis.backlogs, 10) > 0
                      ? `⚠ ${selectedStudentForAnalysis.backlogs} Active Backlog(s)`
                      : '✓ 0 Active Backlogs'}
                  </small>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', marginBottom: '4px' }}>
                    <Layers style={{ width: 16 }} />
                    <b style={{ fontSize: 12 }}>Class Section & Style</b>
                  </div>
                  <h3 style={{ margin: '4px 0', fontSize: 15, color: '#1e293b' }}>
                    {selectedStudentForAnalysis.section} • {selectedStudentForAnalysis.style}
                  </h3>
                  <small style={{ color: '#64748b' }}>Engagement Score: 72/100</small>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '4px' }}>
                    <HeartHandshake style={{ width: 16 }} />
                    <b style={{ fontSize: 12 }}>Socio-economic Need</b>
                  </div>
                  <h3 style={{ margin: '4px 0', fontSize: 15, color: '#1e293b' }}>
                    {selectedStudentForAnalysis.income}
                  </h3>
                  <small style={{ color: '#64748b' }}>Financial Support Recommended</small>
                </div>
              </div>

              {/* Identified Risk Factors */}
              <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <b style={{ color: '#991b1b', fontSize: 12, display: 'block', marginBottom: '4px' }}>
                  Identified Risk Triggers & Factors:
                </b>
                <p style={{ margin: 0, color: '#b91c1c', fontSize: 12 }}>
                  {selectedStudentForAnalysis.factors}
                </p>
              </div>

              {/* AI Recommended Interventions */}
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                <b style={{ color: '#1e40af', fontSize: 12, display: 'block', marginBottom: '6px' }}>
                  AI Suggested Interventions:
                </b>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#1e3a8a', fontSize: 12, lineHeight: 1.6 }}>
                  <li>Schedule 1-on-1 counseling session with student advisor.</li>
                  <li>Assign peer tutor for remedial subject coaching.</li>
                  <li>Send automated performance and attendance update notice to parents.</li>
                </ul>
              </div>
            </div>

            {/* Footer with Delete Option */}
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
                    notify(`Automated parent notice drafted for ${selectedStudentForAnalysis.name}`);
                    setSelectedStudentForAnalysis(null);
                  }}
                  style={{
                    border: 0,
                    background: 'linear-gradient(135deg, #6255ed, #3b82f6)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Send Parent Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
