import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  Upload,
  Download,
  Filter,
  Users,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  Calendar,
  FileSpreadsheet,
  FileText,
  Search,
  BookOpen,
  Laptop,
  Cpu,
  Wrench,
  Building2,
  X,
  Eye,
  Send,
  UserCheck,
  UserX,
  FileCheck,
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import '../styles/attendance.css';

// Initial Student Data exact to the screenshot & expandable
const INITIAL_STUDENTS = [
  {
    id: 'STU1001',
    name: 'Rahul Patel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    initials: 'RP',
    dept: 'Computer Engg.',
    semester: 4,
    subject: 'Data Structures',
    section: 'Section A',
    status: 'Present',
    attendancePct: 87,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1002',
    name: 'Sneha Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'SS',
    dept: 'Information Tech.',
    semester: 4,
    subject: 'Database Mgmt.',
    section: 'Section B',
    status: 'Present',
    attendancePct: 92,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1003',
    name: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    initials: 'AM',
    dept: 'Electronics Engg.',
    semester: 4,
    subject: 'Digital Logic',
    section: 'Section A',
    status: 'Absent',
    attendancePct: 45,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1004',
    name: 'Pooja Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    initials: 'PS',
    dept: 'Mechanical Engg.',
    semester: 4,
    subject: 'Thermodynamics',
    section: 'Section C',
    status: 'Late',
    attendancePct: 68,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1005',
    name: 'Karan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    initials: 'KV',
    dept: 'Computer Engg.',
    semester: 6,
    subject: 'Operating Systems',
    section: 'Section A',
    status: 'Present',
    attendancePct: 83,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1006',
    name: 'Anjali Desai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    initials: 'AD',
    dept: 'Information Tech.',
    semester: 6,
    subject: 'Web Development',
    section: 'Section B',
    status: 'Present',
    attendancePct: 90,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1007',
    name: 'Vivek Yadav',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    initials: 'VY',
    dept: 'Electronics Engg.',
    semester: 6,
    subject: 'Microprocessors',
    section: 'Section A',
    status: 'Late',
    attendancePct: 72,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1008',
    name: 'Neha Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    initials: 'NP',
    dept: 'Mechanical Engg.',
    semester: 6,
    subject: 'Machine Design',
    section: 'Section C',
    status: 'Absent',
    attendancePct: 30,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1009',
    name: 'Rohan Joshi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    initials: 'RJ',
    dept: 'Civil Engg.',
    semester: 4,
    subject: 'Structural Analysis',
    section: 'Section A',
    status: 'Present',
    attendancePct: 78,
    lastUpdated: '13 May 2025'
  },
  {
    id: 'STU1010',
    name: 'Meera Nair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'MN',
    dept: 'Civil Engg.',
    semester: 6,
    subject: 'Fluid Mechanics',
    section: 'Section B',
    status: 'Present',
    attendancePct: 85,
    lastUpdated: '13 May 2025'
  }
];

export default function AttendancePage({ notify = () => {} }) {
  // Filter states
  const [date, setDate] = useState('13 May 2025');
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [subject, setSubject] = useState('All Subjects');
  const [section, setSection] = useState('All Sections');
  const [searchFilter, setSearchFilter] = useState('');

  // Dropdown open controls
  const [openDropdown, setOpenDropdown] = useState(null); // 'date', 'dept', 'sem', 'subj', 'sec', 'mark', 'rows', 'trend'

  // Student dataset & Selection
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Interactive Panels
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Mark Attendance Modal inputs
  const [markForm, setMarkForm] = useState({
    studentId: 'STU1001',
    status: 'Present',
    date: '13 May 2025',
    subject: 'Data Structures',
    remark: ''
  });

  // Trend timeframe
  const [trendTimeframe, setTrendTimeframe] = useState('This Month');
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.att-dropdown-field') && !e.target.closest('.att-action-btn') && !e.target.closest('.att-mark-wrapper')) {
        setOpenDropdown(null);
        setActiveActionMenuId(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const subjectOptions = [
    'All Subjects',
    'Data Structures',
    'Database Mgmt.',
    'Digital Logic',
    'Thermodynamics',
    'Operating Systems',
    'Web Development',
    'Microprocessors',
    'Machine Design',
    'Structural Analysis',
    'Fluid Mechanics'
  ];

  const sectionOptions = [
    'All Sections',
    'Section A',
    'Section B',
    'Section C',
    'Section D'
  ];

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return studentsList.filter((stu) => {
      // Dept filter
      if (department !== 'All Departments' && stu.dept !== department) return false;

      // Semester filter
      if (semester !== 'All Semesters') {
        const semNum = parseInt(semester.replace('Semester ', ''), 10);
        if (stu.semester !== semNum) return false;
      }

      // Subject filter
      if (subject !== 'All Subjects' && stu.subject !== subject) return false;

      // Section filter
      if (section !== 'All Sections' && stu.section !== section) return false;

      // Search Query
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const match =
          stu.name.toLowerCase().includes(q) ||
          stu.id.toLowerCase().includes(q) ||
          stu.dept.toLowerCase().includes(q) ||
          stu.subject.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [studentsList, department, semester, subject, section, searchFilter]);

  // Paginated Rows
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, currentPage, rowsPerPage]);

  const totalResultsCount = 5420; // Indicative total matching system size
  const totalPages = Math.ceil(totalResultsCount / rowsPerPage);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick Status change from action menu
  const handleQuickStatusChange = (id, newStatus) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, lastUpdated: date } : s))
    );
    setActiveActionMenuId(null);
    notify(`Status updated to "${newStatus}" for student ${id}.`);
  };

  // Bulk status update for selected rows
  const handleBulkStatusChange = (newStatus) => {
    setStudentsList((prev) =>
      prev.map((s) => (selectedRowIds.includes(s.id) ? { ...s, status: newStatus, lastUpdated: date } : s))
    );
    notify(`Marked ${selectedRowIds.length} students as "${newStatus}".`);
    setSelectedRowIds([]);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setDepartment('All Departments');
    setSemester('All Semesters');
    setSubject('All Subjects');
    setSection('All Sections');
    setSearchFilter('');
    setDate('13 May 2025');
    notify('All filters reset to default.');
  };

  // Department card click
  const handleDeptCardClick = (deptName) => {
    if (department === deptName) {
      setDepartment('All Departments');
      notify('Cleared department filter.');
    } else {
      setDepartment(deptName);
      notify(`Filtered attendance for ${deptName}.`);
    }
  };

  // Handle Mark Attendance submit
  const handleMarkFormSubmit = (e) => {
    e.preventDefault();
    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === markForm.studentId
          ? { ...s, status: markForm.status, subject: markForm.subject, lastUpdated: markForm.date }
          : s
      )
    );
    setShowMarkModal(false);
    notify(`Attendance recorded successfully for ${markForm.studentId}.`);
  };

  // Trend Data Points
  const trendPoints = [
    { date: '1 May', pct: 72, x: 28, y: 56 },
    { date: '6 May', pct: 48, x: 74, y: 92 },
    { date: '11 May', pct: 68, x: 120, y: 62 },
    { date: '16 May', pct: 75, x: 166, y: 52 },
    { date: '21 May', pct: 70, x: 212, y: 59 },
    { date: '26 May', pct: 85, x: 258, y: 36 },
    { date: '31 May', pct: 68, x: 304, y: 62 }
  ];

  return (
    <div className="attendance-page">
      {/* 1. Page Header */}
      <div className="att-header">
        <div className="att-title-group">
          <div className="att-icon-badge">
            <CalendarCheck size={26} />
          </div>
          <div>
            <h1>Attendance</h1>
            <p>Track and manage student attendance across departments and semesters.</p>
          </div>
        </div>

        <div className="att-actions">
          {/* Mark Attendance with Dropdown Options */}
          <div className="att-dropdown-field att-mark-wrapper">
            <button
              className="btn-primary-purple"
              onClick={() => setOpenDropdown(openDropdown === 'mark' ? null : 'mark')}
            >
              Mark Attendance <ChevronDown size={15} />
            </button>

            {openDropdown === 'mark' && (
              <div className="att-dropdown-menu" style={{ right: 0, left: 'auto', minWidth: 200 }}>
                <button
                  className="att-dropdown-item"
                  onClick={() => {
                    setShowMarkModal(true);
                    setOpenDropdown(null);
                  }}
                >
                  <UserCheck size={14} style={{ marginRight: 8, color: '#5247e6' }} />
                  Single Student Form
                </button>
                <button
                  className="att-dropdown-item"
                  onClick={() => {
                    handleBulkStatusChange('Present');
                    setOpenDropdown(null);
                  }}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 8, color: '#10b981' }} />
                  Mark Visible as Present
                </button>
                <button
                  className="att-dropdown-item"
                  onClick={() => {
                    setOpenDropdown(null);
                    notify('Biometric / RFID Attendance Sync triggered.');
                  }}
                >
                  <Laptop size={14} style={{ marginRight: 8, color: '#0284c7' }} />
                  Sync Biometric Logs
                </button>
                <button
                  className="att-dropdown-item"
                  onClick={() => {
                    setShowUploadModal(true);
                    setOpenDropdown(null);
                  }}
                >
                  <FileSpreadsheet size={14} style={{ marginRight: 8, color: '#ea580c' }} />
                  Bulk Excel / CSV Import
                </button>
              </div>
            )}
          </div>

          <button
            className="btn-outline-action"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={15} /> Upload Attendance
          </button>

          <button
            className="btn-outline-action"
            onClick={() => setShowExportModal(true)}
          >
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="att-stats-grid">
        {/* Overall Attendance */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title blue">Overall Attendance</span>
            <span className="att-stat-value">78.6%</span>
            <span className="att-stat-subtext green">
              <TrendingUp size={13} /> 5.2% from last month
            </span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-donut-wrap">
              <svg viewBox="0 0 70 70">
                <circle className="att-donut-bg" cx="35" cy="35" r="30" />
                <circle className="att-donut-bar" cx="35" cy="35" r="30" />
              </svg>
              <div className="att-donut-center">
                <Users size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Present Students */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title green">Present Students</span>
            <span className="att-stat-value">4,256</span>
            <span className="att-stat-subtext green">78.6% of total students</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle green">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Absent Students */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title amber">Absent Students</span>
            <span className="att-stat-value">856</span>
            <span className="att-stat-subtext amber">15.8% of total students</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle amber">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Late Students */}
        <div className="att-stat-card">
          <div className="att-stat-info">
            <span className="att-stat-title red">Late Students</span>
            <span className="att-stat-value">288</span>
            <span className="att-stat-subtext red">5.3% of total students</span>
          </div>
          <div className="att-stat-icon-wrapper">
            <div className="att-icon-circle red">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar (Select Date, Department, Semester, Subject, Section, Filters) */}
      <div className="att-filter-bar">
        <div className="att-filter-controls">
          {/* Select Date */}
          <div className="att-dropdown-field">
            <label>Select Date</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'date' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            >
              <span className="icon-left">
                <Calendar size={14} /> {date}
              </span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'date' && (
              <div className="att-dropdown-menu">
                {['13 May 2025', '12 May 2025', '11 May 2025', '10 May 2025', '09 May 2025'].map((d) => (
                  <button
                    key={d}
                    className={`att-dropdown-item ${date === d ? 'selected' : ''}`}
                    onClick={() => {
                      setDate(d);
                      setOpenDropdown(null);
                      notify(`Date filter set to ${d}`);
                    }}
                  >
                    {d}
                  </button>
                ))}
                <button
                  className="att-dropdown-item"
                  style={{ color: '#5247e6', fontWeight: 600, borderTop: '1px solid #eef2f7', marginTop: 4 }}
                  onClick={() => {
                    setShowCalendarModal(true);
                    setOpenDropdown(null);
                  }}
                >
                  Open Full Calendar →
                </button>
              </div>
            )}
          </div>

          {/* Department */}
          <div className="att-dropdown-field">
            <label>Department</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'dept' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'dept' ? null : 'dept')}
            >
              <span>{department}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'dept' && (
              <div className="att-dropdown-menu">
                {departmentOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${department === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setDepartment(opt);
                      setOpenDropdown(null);
                      notify(`Department filter set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Semester */}
          <div className="att-dropdown-field">
            <label>Semester</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'sem' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'sem' ? null : 'sem')}
            >
              <span>{semester}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'sem' && (
              <div className="att-dropdown-menu">
                {semesterOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${semester === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setSemester(opt);
                      setOpenDropdown(null);
                      notify(`Semester filter set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subject / Course */}
          <div className="att-dropdown-field">
            <label>Subject / Course</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'subj' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'subj' ? null : 'subj')}
            >
              <span>{subject}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'subj' && (
              <div className="att-dropdown-menu">
                {subjectOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${subject === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setSubject(opt);
                      setOpenDropdown(null);
                      notify(`Subject filter set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Class / Section */}
          <div className="att-dropdown-field">
            <label>Class / Section</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'sec' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'sec' ? null : 'sec')}
            >
              <span>{section}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'sec' && (
              <div className="att-dropdown-menu">
                {sectionOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${section === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setSection(opt);
                      setOpenDropdown(null);
                      notify(`Section filter set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Action Button */}
          <button
            className="att-btn-filter"
            onClick={() => notify(`Filters active: ${filteredStudents.length} matching students found.`)}
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* Clear All */}
        <div className="att-filter-bottom">
          <button className="att-clear-btn" onClick={handleClearFilters}>
            Clear All
          </button>
        </div>
      </div>

      {/* 4. Main 2-Column Section (Left: Attendance Records Table, Right: Insights Sidebar) */}
      <div className="att-main-layout">
        {/* Left Column: Attendance Records Table */}
        <div className="att-table-card">
          <div className="att-table-header">
            <h2>Attendance Records</h2>
            <button
              className="att-btn-calendar"
              onClick={() => setShowCalendarModal(true)}
            >
              <CalendarDays size={14} /> View Calendar
            </button>
          </div>

          <div className="att-table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th className="th-chk">
                    <input
                      type="checkbox"
                      className="att-custom-checkbox"
                      checked={
                        paginatedStudents.length > 0 &&
                        paginatedStudents.every((s) => selectedRowIds.includes(s.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Attendance %</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((stu) => {
                  const isSelected = selectedRowIds.includes(stu.id);
                  const isMenuOpen = activeActionMenuId === stu.id;

                  // Progress bar color based on percentage
                  const barColorClass =
                    stu.attendancePct >= 75
                      ? 'green'
                      : stu.attendancePct >= 60
                      ? 'amber'
                      : 'red';

                  return (
                    <tr
                      key={stu.id}
                      className={isSelected ? 'row-selected' : ''}
                    >
                      <td className="td-chk">
                        <input
                          type="checkbox"
                          className="att-custom-checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(stu.id)}
                        />
                      </td>
                      <td className="att-stu-id">{stu.id}</td>
                      <td>
                        <div className="att-stu-info">
                          {stu.avatar ? (
                            <img
                              src={stu.avatar}
                              alt={stu.name}
                              className="att-stu-avatar"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="att-stu-avatar-fallback"
                            style={{ display: stu.avatar ? 'none' : 'flex' }}
                          >
                            {stu.initials}
                          </div>
                          <span className="att-stu-name">{stu.name}</span>
                        </div>
                      </td>
                      <td>{stu.dept}</td>
                      <td>{stu.semester}</td>
                      <td>{stu.subject}</td>
                      <td>
                        <span className={`att-badge-status ${stu.status.toLowerCase()}`}>
                          {stu.status}
                        </span>
                      </td>
                      <td>
                        <div className="att-pct-cell">
                          <span className="att-pct-val">{stu.attendancePct}%</span>
                          <span className="att-progress-track">
                            <i
                              className={`att-progress-fill ${barColorClass}`}
                              style={{ width: `${stu.attendancePct}%` }}
                            />
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#475569' }}>{stu.lastUpdated}</td>
                      <td style={{ position: 'relative' }}>
                        <button
                          className="att-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenuId(isMenuOpen ? null : stu.id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div className="att-row-menu">
                            <button
                              onClick={() => {
                                setSelectedStudentDetail(stu);
                                setActiveActionMenuId(null);
                              }}
                            >
                              <Eye size={13} style={{ color: '#5247e6' }} /> View Profile & History
                            </button>
                            <button onClick={() => handleQuickStatusChange(stu.id, 'Present')}>
                              <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Mark Present
                            </button>
                            <button onClick={() => handleQuickStatusChange(stu.id, 'Absent')}>
                              <XCircle size={13} style={{ color: '#ef4444' }} /> Mark Absent
                            </button>
                            <button onClick={() => handleQuickStatusChange(stu.id, 'Late')}>
                              <Clock3 size={13} style={{ color: '#f59e0b' }} /> Mark Late
                            </button>
                            <button
                              onClick={() => {
                                setActiveActionMenuId(null);
                                notify(`Sent attendance SMS & email notification for ${stu.name}.`);
                              }}
                            >
                              <Send size={13} style={{ color: '#0284c7' }} /> Send Alert to Parent
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="att-table-footer">
            <span>
              Showing 1 to {paginatedStudents.length} of {totalResultsCount.toLocaleString()} results
            </span>

            <div className="att-pagination-controls">
              <div className="att-rows-per-page">
                <span>Rows per page:</span>
                <select
                  className="att-rows-select"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="att-pages-list">
                <button
                  className="att-page-nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  className={`att-page-num ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <button
                  className={`att-page-num ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
                <button
                  className={`att-page-num ${currentPage === 3 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </button>
                <span className="att-page-dots">...</span>
                <button
                  className={`att-page-num ${currentPage === 542 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(542)}
                >
                  542
                </button>

                <button
                  className="att-page-nav-btn"
                  disabled={currentPage === 542}
                  onClick={() => setCurrentPage((p) => Math.min(542, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Insight Cards */}
        <div className="att-sidebar">
          {/* Card 1: Attendance Overview (This Month) */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>
                Attendance Overview <span className="att-subtitle-badge">(This Month)</span>
              </h3>
            </div>

            <div className="att-overview-body">
              {/* Donut Chart SVG */}
              <div className="att-donut-chart-container">
                <svg viewBox="0 0 100 100" className="att-donut-chart-svg">
                  {/* Present (Green): 78.6% = ~197.5 deg */}
                  <circle
                    className="att-donut-slice"
                    cx="50"
                    cy="50"
                    r="34"
                    stroke="#10b981"
                    strokeDasharray="167.9 213.6"
                    strokeDashoffset="0"
                    onMouseEnter={() => setHoveredDonutSlice('Present: 78.6% (4,256)')}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                  />
                  {/* Absent (Red): 15.8% = ~33.7 */}
                  <circle
                    className="att-donut-slice"
                    cx="50"
                    cy="50"
                    r="34"
                    stroke="#ef4444"
                    strokeDasharray="33.7 213.6"
                    strokeDashoffset="-167.9"
                    onMouseEnter={() => setHoveredDonutSlice('Absent: 15.8% (856)')}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                  />
                  {/* Late (Orange): 5.3% = ~11.3 */}
                  <circle
                    className="att-donut-slice"
                    cx="50"
                    cy="50"
                    r="34"
                    stroke="#f59e0b"
                    strokeDasharray="11.3 213.6"
                    strokeDashoffset="-201.6"
                    onMouseEnter={() => setHoveredDonutSlice('Late: 5.3% (288)')}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                  />
                  {/* Leave (Blue): 0.3% = ~0.7 */}
                  <circle
                    className="att-donut-slice"
                    cx="50"
                    cy="50"
                    r="34"
                    stroke="#3b82f6"
                    strokeDasharray="2.5 213.6"
                    strokeDashoffset="-212.9"
                    onMouseEnter={() => setHoveredDonutSlice('Leave: 0.3% (20)')}
                    onMouseLeave={() => setHoveredDonutSlice(null)}
                  />
                </svg>
              </div>

              {/* Legend List */}
              <div className="att-overview-legend">
                <div className="att-legend-row">
                  <div className="att-legend-label">
                    <span className="att-legend-dot green" />
                    <span>Present</span>
                  </div>
                  <div className="att-legend-stat">
                    78.6% <span>(4,256)</span>
                  </div>
                </div>

                <div className="att-legend-row">
                  <div className="att-legend-label">
                    <span className="att-legend-dot red" />
                    <span>Absent</span>
                  </div>
                  <div className="att-legend-stat">
                    15.8% <span>(856)</span>
                  </div>
                </div>

                <div className="att-legend-row">
                  <div className="att-legend-label">
                    <span className="att-legend-dot amber" />
                    <span>Late</span>
                  </div>
                  <div className="att-legend-stat">
                    5.3% <span>(288)</span>
                  </div>
                </div>

                <div className="att-legend-row">
                  <div className="att-legend-label">
                    <span className="att-legend-dot blue" />
                    <span>Leave</span>
                  </div>
                  <div className="att-legend-stat">
                    0.3% <span>(20)</span>
                  </div>
                </div>
              </div>
            </div>
            {hoveredDonutSlice && (
              <div style={{ textAlign: 'center', fontSize: 11, color: '#5247e6', fontWeight: 600, marginTop: 6 }}>
                {hoveredDonutSlice}
              </div>
            )}
          </div>

          {/* Card 2: Attendance Trend */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>Attendance Trend</h3>
              <select
                className="att-time-select"
                value={trendTimeframe}
                onChange={(e) => {
                  setTrendTimeframe(e.target.value);
                  notify(`Trend period updated to ${e.target.value}`);
                }}
              >
                <option value="This Month">This Month</option>
                <option value="This Week">This Week</option>
                <option value="This Semester">This Semester</option>
                <option value="This Year">This Year</option>
              </select>
            </div>

            <div className="att-trend-body">
              <svg viewBox="0 0 330 130" className="att-trend-chart-svg">
                {/* Horizontal Grid lines & Y-Axis */}
                <g className="att-grid">
                  <line x1="28" y1="18" x2="310" y2="18" className="att-grid-line" />
                  <text x="5" y="21" className="att-axis-text">100%</text>

                  <line x1="28" y1="44" x2="310" y2="44" className="att-grid-line" />
                  <text x="8" y="47" className="att-axis-text">75%</text>

                  <line x1="28" y1="70" x2="310" y2="70" className="att-grid-line" />
                  <text x="8" y="73" className="att-axis-text">50%</text>

                  <line x1="28" y1="96" x2="310" y2="96" className="att-grid-line" />
                  <text x="8" y="99" className="att-axis-text">25%</text>

                  <line x1="28" y1="118" x2="310" y2="118" className="att-grid-line" />
                  <text x="14" y="121" className="att-axis-text">0%</text>
                </g>

                {/* X-Axis dates */}
                <g className="att-axis-x">
                  <text x="20" y="130" className="att-axis-text">1 May</text>
                  <text x="66" y="130" className="att-axis-text">6 May</text>
                  <text x="110" y="130" className="att-axis-text">11 May</text>
                  <text x="156" y="130" className="att-axis-text">16 May</text>
                  <text x="202" y="130" className="att-axis-text">21 May</text>
                  <text x="248" y="130" className="att-axis-text">26 May</text>
                  <text x="294" y="130" className="att-axis-text">31 May</text>
                </g>

                {/* Trend Polyline */}
                <polyline
                  className="att-trend-line"
                  points="28,56 74,92 120,62 166,52 212,59 258,36 304,62"
                />

                {/* Data Points */}
                {trendPoints.map((p) => (
                  <circle
                    key={p.date}
                    className="att-trend-dot"
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    onMouseEnter={() => setHoveredTrendPoint(p)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  />
                ))}
              </svg>

              {hoveredTrendPoint && (
                <div
                  style={{
                    position: 'absolute',
                    top: hoveredTrendPoint.y - 28,
                    left: hoveredTrendPoint.x,
                    transform: 'translateX(-50%)',
                    background: '#0b153b',
                    color: '#fff',
                    padding: '3px 7px',
                    borderRadius: 5,
                    fontSize: 10,
                    fontWeight: 600,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  {hoveredTrendPoint.date}: {hoveredTrendPoint.pct}%
                </div>
              )}
            </div>

            <div className="att-trend-footer">
              <TrendingUp size={13} /> 5.2% improvement from last month
            </div>
          </div>

          {/* Card 3: Low Attendance Students */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>Low Attendance Students</h3>
              <button
                className="att-link-view"
                onClick={() => {
                  setSearchFilter('');
                  notify('Filtered table to show students below 75% attendance.');
                }}
              >
                View All
              </button>
            </div>

            <div className="att-low-students-list">
              {/* Neha Patel */}
              <div className="att-low-student-item">
                <div className="att-low-student-left">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                    alt="Neha Patel"
                    className="att-stu-avatar"
                  />
                  <div className="att-low-student-info">
                    <h4>Neha Patel</h4>
                    <span>STU1008</span>
                  </div>
                </div>
                <span className="att-low-pct-pill red">30%</span>
              </div>

              {/* Aarav Mehta */}
              <div className="att-low-student-item">
                <div className="att-low-student-left">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Aarav Mehta"
                    className="att-stu-avatar"
                  />
                  <div className="att-low-student-info">
                    <h4>Aarav Mehta</h4>
                    <span>STU1003</span>
                  </div>
                </div>
                <span className="att-low-pct-pill red">45%</span>
              </div>

              {/* Pooja Sharma */}
              <div className="att-low-student-item">
                <div className="att-low-student-left">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Pooja Sharma"
                    className="att-stu-avatar"
                  />
                  <div className="att-low-student-info">
                    <h4>Pooja Sharma</h4>
                    <span>STU1004</span>
                  </div>
                </div>
                <span className="att-low-pct-pill amber">68%</span>
              </div>
            </div>

            <button
              className="att-action-link"
              onClick={() => {
                notify('Intervention workflow triggered for low attendance students.');
              }}
            >
              Take action to improve attendance <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Department Wise Attendance */}
      <div className="att-dept-section">
        <div className="att-dept-head">
          <h3>Department Wise Attendance</h3>
          <button
            className="att-btn-report"
            onClick={() => notify('Department Detailed Attendance Report generated.')}
          >
            View Full Report
          </button>
        </div>

        <div className="att-dept-grid">
          {/* Computer Engg. */}
          <div
            className={`att-dept-card ${department === 'Computer Engg.' ? 'selected' : ''}`}
            onClick={() => handleDeptCardClick('Computer Engg.')}
          >
            <div className="att-dept-icon-box blue">
              <Laptop size={18} />
            </div>
            <div className="att-dept-info">
              <span className="att-dept-name">Computer Engg.</span>
              <span className="att-dept-val">82.4%</span>
            </div>
          </div>

          {/* Information Tech. */}
          <div
            className={`att-dept-card ${department === 'Information Tech.' ? 'selected' : ''}`}
            onClick={() => handleDeptCardClick('Information Tech.')}
          >
            <div className="att-dept-icon-box green">
              <BookOpen size={18} />
            </div>
            <div className="att-dept-info">
              <span className="att-dept-name">Information Tech.</span>
              <span className="att-dept-val">79.1%</span>
            </div>
          </div>

          {/* Electronics Engg. */}
          <div
            className={`att-dept-card ${department === 'Electronics Engg.' ? 'selected' : ''}`}
            onClick={() => handleDeptCardClick('Electronics Engg.')}
          >
            <div className="att-dept-icon-box purple">
              <Cpu size={18} />
            </div>
            <div className="att-dept-info">
              <span className="att-dept-name">Electronics Engg.</span>
              <span className="att-dept-val">76.3%</span>
            </div>
          </div>

          {/* Mechanical Engg. */}
          <div
            className={`att-dept-card ${department === 'Mechanical Engg.' ? 'selected' : ''}`}
            onClick={() => handleDeptCardClick('Mechanical Engg.')}
          >
            <div className="att-dept-icon-box amber">
              <Wrench size={18} />
            </div>
            <div className="att-dept-info">
              <span className="att-dept-name">Mechanical Engg.</span>
              <span className="att-dept-val">74.8%</span>
            </div>
          </div>

          {/* Civil Engg. */}
          <div
            className={`att-dept-card ${department === 'Civil Engg.' ? 'selected' : ''}`}
            onClick={() => handleDeptCardClick('Civil Engg.')}
          >
            <div className="att-dept-icon-box cyan">
              <Building2 size={18} />
            </div>
            <div className="att-dept-info">
              <span className="att-dept-name">Civil Engg.</span>
              <span className="att-dept-val">71.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Batch Actions Bar when rows are selected */}
      {selectedRowIds.length > 0 && (
        <div className="att-batch-bar">
          <span>{selectedRowIds.length} student(s) selected</span>
          <button className="att-batch-btn" onClick={() => handleBulkStatusChange('Present')}>
            <CheckCircle2 size={13} /> Mark Present
          </button>
          <button className="att-batch-btn" onClick={() => handleBulkStatusChange('Absent')}>
            <XCircle size={13} /> Mark Absent
          </button>
          <button className="att-batch-btn" onClick={() => handleBulkStatusChange('Late')}>
            <Clock3 size={13} /> Mark Late
          </button>
          <button
            className="att-batch-btn"
            onClick={() => {
              notify(`Batch email & SMS notification dispatched to ${selectedRowIds.length} parents.`);
              setSelectedRowIds([]);
            }}
          >
            <Send size={13} /> Send Alert
          </button>
          <button
            className="att-batch-btn danger"
            onClick={() => setSelectedRowIds([])}
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* MODAL 1: Mark Attendance Form Modal */}
      {showMarkModal && (
        <div className="att-modal-overlay" onClick={() => setShowMarkModal(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <UserCheck size={18} style={{ color: '#5247e6' }} /> Mark Student Attendance
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowMarkModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleMarkFormSubmit}>
              <div className="att-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Select Student
                    </label>
                    <select
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #dce4f2', borderRadius: 8, fontSize: 13 }}
                      value={markForm.studentId}
                      onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                    >
                      {studentsList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id} - {s.name} ({s.dept})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Attendance Status
                    </label>
                    <select
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #dce4f2', borderRadius: 8, fontSize: 13 }}
                      value={markForm.status}
                      onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Leave">Leave / Excused</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Date
                    </label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #dce4f2', borderRadius: 8, fontSize: 13 }}
                      value={markForm.date}
                      onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                      Subject
                    </label>
                    <select
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #dce4f2', borderRadius: 8, fontSize: 13 }}
                      value={markForm.subject}
                      onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}
                    >
                      {subjectOptions.filter((s) => s !== 'All Subjects').map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                    Notes / Remarks (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter reason for absence or note..."
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #dce4f2', borderRadius: 8, fontSize: 13, resize: 'none' }}
                    value={markForm.remark}
                    onChange={(e) => setMarkForm({ ...markForm, remark: e.target.value })}
                  />
                </div>
              </div>

              <div className="att-modal-footer">
                <button
                  type="button"
                  className="btn-outline-action"
                  onClick={() => setShowMarkModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-purple">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Attendance Modal */}
      {showUploadModal && (
        <div className="att-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <Upload size={18} style={{ color: '#5247e6' }} /> Upload Attendance File
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowUploadModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="att-modal-body">
              <div
                className="att-upload-zone"
                onClick={() => {
                  notify('File "Attendance_May2025.xlsx" selected.');
                }}
              >
                <FileSpreadsheet className="att-upload-icon" />
                <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#0b153b' }}>
                  Click to browse or drag and drop attendance sheet
                </p>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Supports .XLSX, .XLS, .CSV files up to 25MB
                </span>
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Need standard template?
                </span>
                <button
                  className="att-clear-btn"
                  onClick={() => notify('Downloading attendance_template.xlsx...')}
                >
                  Download Template .XLSX
                </button>
              </div>
            </div>

            <div className="att-modal-footer">
              <button className="btn-outline-action" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary-purple"
                onClick={() => {
                  setShowUploadModal(false);
                  notify('Attendance data imported successfully. 120 records updated.');
                }}
              >
                Start Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Export Report Modal */}
      {showExportModal && (
        <div className="att-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <Download size={18} style={{ color: '#5247e6' }} /> Export Attendance Reports
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="att-modal-body">
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
                Select format and scope for the attendance summary report:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
                <div
                  style={{
                    border: '1.5px solid #5247e6',
                    background: '#f0efff',
                    borderRadius: 10,
                    padding: 14,
                    cursor: 'pointer'
                  }}
                >
                  <b style={{ display: 'block', color: '#5247e6', fontSize: 13 }}>📊 Excel Spreadsheet (.xlsx)</b>
                  <small style={{ color: '#64748b' }}>Includes full student logs & formulas</small>
                </div>

                <div
                  style={{
                    border: '1px solid #dce4f2',
                    borderRadius: 10,
                    padding: 14,
                    cursor: 'pointer'
                  }}
                  onClick={() => notify('PDF Report format selected.')}
                >
                  <b style={{ display: 'block', color: '#0b153b', fontSize: 13 }}>📑 PDF Executive Summary</b>
                  <small style={{ color: '#64748b' }}>Visual charts & department breakdowns</small>
                </div>
              </div>
            </div>

            <div className="att-modal-footer">
              <button className="btn-outline-action" onClick={() => setShowExportModal(false)}>
                Close
              </button>
              <button
                className="btn-primary-purple"
                onClick={() => {
                  setShowExportModal(false);
                  notify('Report export complete: EduSuccess_Attendance_May2025.xlsx downloaded.');
                }}
              >
                Download Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Calendar View Modal */}
      {showCalendarModal && (
        <div className="att-modal-overlay" onClick={() => setShowCalendarModal(false)}>
          <div className="att-modal-card large" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <CalendarDays size={18} style={{ color: '#5247e6' }} /> Attendance Calendar - May 2025
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowCalendarModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="att-modal-body">
              <div className="att-cal-month-header">
                <b>May 2025</b>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  🟢 ≥80% High | 🟡 60-79% Medium | 🔴 &lt;60% Low
                </span>
              </div>

              <div className="att-cal-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="att-cal-day-label">
                    {d}
                  </div>
                ))}

                {/* Blank days */}
                <div />
                <div />
                <div />
                <div />

                {/* Days 1 to 31 */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const isSun = (day + 4) % 7 === 1;
                  const isSat = (day + 4) % 7 === 0;
                  const pct = isSun || isSat ? null : (70 + (day * 3) % 25);

                  const level = isSun || isSat ? 'holiday' : pct >= 80 ? 'high' : pct >= 65 ? 'mid' : 'low';

                  return (
                    <div
                      key={day}
                      className={`att-cal-cell ${level}`}
                      onClick={() => {
                        if (!isSun && !isSat) {
                          setDate(`${day} May 2025`);
                          setShowCalendarModal(false);
                          notify(`Showing records for ${day} May 2025 (${pct}% attendance).`);
                        }
                      }}
                    >
                      <span>{day}</span>
                      {pct ? (
                        <span className={`att-cal-badge-pill ${level}`}>{pct}%</span>
                      ) : (
                        <span style={{ fontSize: 8, color: '#94a3b8' }}>Off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="att-modal-footer">
              <button className="btn-primary-purple" onClick={() => setShowCalendarModal(false)}>
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Student Profile & History Modal */}
      {selectedStudentDetail && (
        <div className="att-modal-overlay" onClick={() => setSelectedStudentDetail(null)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={selectedStudentDetail.avatar}
                  alt={selectedStudentDetail.name}
                  className="att-stu-avatar"
                  style={{ width: 40, height: 40 }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{selectedStudentDetail.name}</h3>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {selectedStudentDetail.id} • {selectedStudentDetail.dept} (Sem {selectedStudentDetail.semester})
                  </span>
                </div>
              </div>
              <button className="att-modal-close-btn" onClick={() => setSelectedStudentDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="att-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Overall Attendance</small>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: 18, color: selectedStudentDetail.attendancePct >= 75 ? '#10b981' : '#ef4444' }}>
                    {selectedStudentDetail.attendancePct}%
                  </h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Classes Attended</small>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: 18, color: '#0b153b' }}>
                    {Math.round((selectedStudentDetail.attendancePct * 60) / 100)} / 60
                  </h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Current Status</small>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: 18, color: '#5247e6' }}>
                    {selectedStudentDetail.status}
                  </h4>
                </div>
              </div>

              <h4 style={{ fontSize: 13, margin: '14px 0 8px 0', color: '#0b153b' }}>
                Subject-wise Breakdown
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{selectedStudentDetail.subject}</span>
                  <b>{selectedStudentDetail.attendancePct}%</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Algorithms & Design</span>
                  <b>85%</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Computer Networks</span>
                  <b>78%</b>
                </div>
              </div>
            </div>

            <div className="att-modal-footer">
              <button
                className="btn-outline-action"
                onClick={() => {
                  notify(`Attendance warning letter generated for ${selectedStudentDetail.name}.`);
                  setSelectedStudentDetail(null);
                }}
              >
                <FileText size={14} /> Generate Warning Letter
              </button>
              <button
                className="btn-primary-purple"
                onClick={() => {
                  notify(`Parent alert dispatched for ${selectedStudentDetail.name}.`);
                  setSelectedStudentDetail(null);
                }}
              >
                <Send size={14} /> Send Alert to Parent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
