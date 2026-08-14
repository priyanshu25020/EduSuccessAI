import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  GraduationCap,
  Users,
  BarChart3,
  Star,
  AlertTriangle,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  Laptop,
  Cpu,
  Globe,
  Wrench,
  Lightbulb,
  ArrowRight,
  X,
  FileSpreadsheet
} from 'lucide-react';
import '../styles/attendance.css';
import '../styles/learning-insights.css';

const INITIAL_SUBJECTS = [
  {
    name: 'Data Structures',
    enrolled: '1,256',
    avgMarks: 86.2,
    grade: 'A',
    gradeClass: 'green',
    passPct: 96,
    trend: 'up',
    points: [78, 80, 83, 85, 86.2],
    color: '#10b981'
  },
  {
    name: 'Database Management',
    enrolled: '1,198',
    avgMarks: 81.5,
    grade: 'A-',
    gradeClass: 'green',
    passPct: 94,
    trend: 'up',
    points: [75, 77, 79, 80, 81.5],
    color: '#10b981'
  },
  {
    name: 'Operating Systems',
    enrolled: '1,245',
    avgMarks: 79.8,
    grade: 'B+',
    gradeClass: 'blue',
    passPct: 91,
    trend: 'up',
    points: [72, 74, 76, 78, 79.8],
    color: '#10b981'
  },
  {
    name: 'Computer Networks',
    enrolled: '1,182',
    avgMarks: 77.4,
    grade: 'B+',
    gradeClass: 'blue',
    passPct: 89,
    trend: 'up',
    points: [70, 72, 75, 76, 77.4],
    color: '#10b981'
  },
  {
    name: 'Software Engineering',
    enrolled: '1,130',
    avgMarks: 74.8,
    grade: 'B',
    gradeClass: 'amber',
    passPct: 87,
    trend: 'down',
    points: [76, 76, 75, 74, 74.8],
    color: '#f59e0b'
  }
];

export default function AcademicPerformancePage({ notify = () => {} }) {
  // Dropdown states
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [subject, setSubject] = useState('All Subjects');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [evaluationType, setEvaluationType] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination & Modals
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState(null);
  const [trendTimeframe, setTrendTimeframe] = useState('This Semester');
  const [hoveredWeek, setHoveredWeek] = useState(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.att-dropdown-field')) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    'Database Management',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Thermodynamics',
    'Digital Logic'
  ];

  const yearOptions = ['2024-25', '2023-24', '2022-23'];
  const evalOptions = ['All', 'Mid-Term Exams', 'End-Term Exams', 'Assignments', 'Quizzes'];

  const filteredSubjects = useMemo(() => {
    return INITIAL_SUBJECTS.filter((sub) => {
      if (subject !== 'All Subjects' && sub.name !== subject) return false;
      return true;
    });
  }, [subject]);

  const handleClearFilters = () => {
    setDepartment('All Departments');
    setSemester('All Semesters');
    setSubject('All Subjects');
    setAcademicYear('2024-25');
    setEvaluationType('All');
    notify('Academic performance filters reset to default.');
  };

  // Trend line points (Week 1 to Week 7)
  const trendPoints = [
    { week: 'Week 1', cgpa: 6.72, x: 30, y: 92 },
    { week: 'Week 2', cgpa: 6.91, x: 75, y: 78 },
    { week: 'Week 3', cgpa: 7.05, x: 120, y: 68 },
    { week: 'Week 4', cgpa: 7.28, x: 165, y: 52 },
    { week: 'Week 5', cgpa: 7.34, x: 210, y: 47 },
    { week: 'Week 6', cgpa: 7.42, x: 255, y: 41 },
    { week: 'Week 7', cgpa: 7.50, x: 300, y: 35 }
  ];

  return (
    <div className="insights-page">
      {/* 1. Page Header */}
      <div className="ins-header">
        <div className="ins-title-group">
          <div className="ins-icon-badge blue">
            <TrendingUp size={26} />
          </div>
          <div>
            <h1>Academic Performance</h1>
            <p>Analyze and track student academic performance across subjects, semesters and departments.</p>
          </div>
        </div>

        <div className="ins-actions">
          <button className="btn-outline-action" onClick={() => setShowExportModal(true)}>
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* 2. Top 5 Metric Cards */}
      <div className="ins-stats-5">
        {/* Average CGPA */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title blue">Average CGPA</span>
            <span className="ins-stat-value">
              7.42 <em>/ 10</em>
            </span>
            <span className="ins-stat-subtext green">
              <TrendingUp size={12} /> 0.38 from last month
            </span>
          </div>
          <div className="ins-stat-icon-circle blue">
            <GraduationCap size={22} />
          </div>
        </div>

        {/* Students Above 7 CGPA */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title green">Students Above 7 CGPA</span>
            <span className="ins-stat-value">2,814</span>
            <span className="ins-stat-subtext green">52.1% of total students</span>
          </div>
          <div className="ins-stat-icon-circle green">
            <Users size={22} />
          </div>
        </div>

        {/* Students Below 5 CGPA */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title amber">Students Below 5 CGPA</span>
            <span className="ins-stat-value">736</span>
            <span className="ins-stat-subtext amber">13.6% of total students</span>
          </div>
          <div className="ins-stat-icon-circle amber">
            <BarChart3 size={22} />
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title purple">Top Performing Students</span>
            <span className="ins-stat-value">428</span>
            <span className="ins-stat-subtext purple">7.9% of total students</span>
          </div>
          <div className="ins-stat-icon-circle purple">
            <Star size={22} />
          </div>
        </div>

        {/* At Risk (CGPA < 5) */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title red">At Risk (CGPA &lt; 5)</span>
            <span className="ins-stat-value">736</span>
            <span className="ins-stat-subtext red">13.6% need improvement</span>
          </div>
          <div className="ins-stat-icon-circle red">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="ins-filter-bar">
        <div className="ins-filter-controls-5">
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

          {/* Academic Year */}
          <div className="att-dropdown-field">
            <label>Academic Year</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'year' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
            >
              <span>{academicYear}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'year' && (
              <div className="att-dropdown-menu">
                {yearOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${academicYear === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setAcademicYear(opt);
                      setOpenDropdown(null);
                      notify(`Academic Year set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Evaluation Type */}
          <div className="att-dropdown-field">
            <label>Evaluation Type</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'eval' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'eval' ? null : 'eval')}
            >
              <span>{evaluationType}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'eval' && (
              <div className="att-dropdown-menu">
                {evalOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${evaluationType === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setEvaluationType(opt);
                      setOpenDropdown(null);
                      notify(`Evaluation Type set to ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            className="att-btn-filter"
            style={{ marginTop: 19 }}
            onClick={() => notify('Academic Performance filters applied.')}
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        <button className="att-clear-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

      {/* 4. Middle 3-Column Section */}
      <div className="ins-grid-3">
        {/* Card 1: CGPA Distribution */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>CGPA Distribution</h3>
          </div>

          <div className="ins-donut-center-group">
            <div className="ins-donut-center-box">
              <svg viewBox="0 0 100 100" className="ins-donut-center-svg">
                {/* 9 - 10 Excellent (Green): 18% = 38.5 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#10b981"
                  strokeDasharray="38.5 213.6"
                  strokeDashoffset="0"
                />
                {/* 7 - 8.9 Good (Light Green): 32% = 68.3 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#84cc16"
                  strokeDasharray="68.3 213.6"
                  strokeDashoffset="-38.5"
                />
                {/* 6 - 6.9 Average (Yellow): 28% = 59.8 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#eab308"
                  strokeDasharray="59.8 213.6"
                  strokeDashoffset="-106.8"
                />
                {/* 5 - 5.9 Below Avg (Orange): 15% = 32.0 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#f97316"
                  strokeDasharray="32.0 213.6"
                  strokeDashoffset="-166.6"
                />
                {/* < 5 Poor (Purple/Red): 7% = 15.0 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#8b5cf6"
                  strokeDasharray="15.0 213.6"
                  strokeDashoffset="-198.6"
                />
              </svg>
              <div className="ins-donut-center-text">
                <b>5,420</b>
                <small>Total Students</small>
              </div>
            </div>

            <div className="ins-donut-legend">
              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#10b981' }} />
                  <span>9 - 10 (Excellent)</span>
                </div>
                <div className="ins-donut-legend-stat">
                  18% <span>(974)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#84cc16' }} />
                  <span>7 - 8.9 (Good)</span>
                </div>
                <div className="ins-donut-legend-stat">
                  32% <span>(1,734)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#eab308' }} />
                  <span>6 - 6.9 (Average)</span>
                </div>
                <div className="ins-donut-legend-stat">
                  28% <span>(1,518)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#f97316' }} />
                  <span>5 - 5.9 (Below Average)</span>
                </div>
                <div className="ins-donut-legend-stat">
                  15% <span>(812)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#ef4444' }} />
                  <span>&lt; 5 (Poor)</span>
                </div>
                <div className="ins-donut-legend-stat">
                  7% <span>(382)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Average CGPA Trend */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Average CGPA Trend</h3>
            <select
              className="att-time-select"
              value={trendTimeframe}
              onChange={(e) => {
                setTrendTimeframe(e.target.value);
                notify(`CGPA Trend period: ${e.target.value}`);
              }}
            >
              <option value="This Semester">This Semester</option>
              <option value="Last Semester">Last Semester</option>
              <option value="Year 2024-25">Year 2024-25</option>
            </select>
          </div>

          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <svg viewBox="0 0 330 140" className="att-trend-chart-svg">
              <g className="att-grid">
                <line x1="28" y1="18" x2="310" y2="18" className="att-grid-line" />
                <text x="5" y="21" className="att-axis-text">8.5</text>

                <line x1="28" y1="44" x2="310" y2="44" className="att-grid-line" />
                <text x="5" y="47" className="att-axis-text">8.0</text>

                <line x1="28" y1="70" x2="310" y2="70" className="att-grid-line" />
                <text x="5" y="73" className="att-axis-text">7.5</text>

                <line x1="28" y1="96" x2="310" y2="96" className="att-grid-line" />
                <text x="5" y="99" className="att-axis-text">7.0</text>

                <line x1="28" y1="120" x2="310" y2="120" className="att-grid-line" />
                <text x="5" y="123" className="att-axis-text">6.5</text>
              </g>

              {/* X-axis */}
              <g className="att-axis-x">
                {trendPoints.map((p) => (
                  <text key={p.week} x={p.x - 12} y="134" className="att-axis-text">
                    {p.week}
                  </text>
                ))}
              </g>

              {/* Line graph */}
              <polyline
                className="att-trend-line"
                style={{ stroke: '#2563eb' }}
                points="30,92 75,78 120,68 165,52 210,47 255,41 300,35"
              />

              {/* Data points with text labels */}
              {trendPoints.map((p) => (
                <g key={p.week}>
                  <circle
                    className="att-trend-dot"
                    style={{ stroke: '#2563eb' }}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    onMouseEnter={() => setHoveredWeek(p)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  />
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    style={{ fontSize: 8.5, fontWeight: 700, fill: '#0b153b' }}
                  >
                    {p.cgpa.toFixed(2)}
                  </text>
                </g>
              ))}
            </svg>

            <div className="att-trend-footer">
              <TrendingUp size={13} /> 0.78 improvement from last semester
            </div>
          </div>
        </div>

        {/* Card 3: Top Performing Subjects */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Top Performing Subjects</h3>
            <select className="att-time-select" defaultValue="This Semester">
              <option>This Semester</option>
              <option>Annual</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {/* Data Structures */}
            <div className="ins-subject-item">
              <div className="ins-subject-left">
                <div className="ins-subject-icon blue">
                  <Laptop size={15} />
                </div>
                <div className="ins-subject-info">
                  <span className="ins-subject-title">Data Structures</span>
                  <div className="ins-subject-bar-track">
                    <div className="ins-subject-bar-fill" style={{ width: '86%', background: '#10b981' }} />
                  </div>
                </div>
              </div>
              <span className="ins-subject-cgpa">8.62</span>
            </div>

            {/* Database Management */}
            <div className="ins-subject-item">
              <div className="ins-subject-left">
                <div className="ins-subject-icon green">
                  <BookOpen size={15} />
                </div>
                <div className="ins-subject-info">
                  <span className="ins-subject-title">Database Management</span>
                  <div className="ins-subject-bar-track">
                    <div className="ins-subject-bar-fill" style={{ width: '81%', background: '#10b981' }} />
                  </div>
                </div>
              </div>
              <span className="ins-subject-cgpa">8.15</span>
            </div>

            {/* Operating Systems */}
            <div className="ins-subject-item">
              <div className="ins-subject-left">
                <div className="ins-subject-icon pink">
                  <Cpu size={15} />
                </div>
                <div className="ins-subject-info">
                  <span className="ins-subject-title">Operating Systems</span>
                  <div className="ins-subject-bar-track">
                    <div className="ins-subject-bar-fill" style={{ width: '79%', background: '#3b82f6' }} />
                  </div>
                </div>
              </div>
              <span className="ins-subject-cgpa">7.98</span>
            </div>

            {/* Computer Networks */}
            <div className="ins-subject-item">
              <div className="ins-subject-left">
                <div className="ins-subject-icon cyan">
                  <Globe size={15} />
                </div>
                <div className="ins-subject-info">
                  <span className="ins-subject-title">Computer Networks</span>
                  <div className="ins-subject-bar-track">
                    <div className="ins-subject-bar-fill" style={{ width: '77%', background: '#3b82f6' }} />
                  </div>
                </div>
              </div>
              <span className="ins-subject-cgpa">7.74</span>
            </div>

            {/* Software Engineering */}
            <div className="ins-subject-item">
              <div className="ins-subject-left">
                <div className="ins-subject-icon orange">
                  <Wrench size={15} />
                </div>
                <div className="ins-subject-info">
                  <span className="ins-subject-title">Software Engineering</span>
                  <div className="ins-subject-bar-track">
                    <div className="ins-subject-bar-fill" style={{ width: '74%', background: '#3b82f6' }} />
                  </div>
                </div>
              </div>
              <span className="ins-subject-cgpa">7.48</span>
            </div>

            <button
              className="att-action-link"
              style={{ marginTop: 'auto' }}
              onClick={() => notify('Showing performance list for all 12 subjects.')}
            >
              View All Subjects <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Split Section */}
      <div className="ins-lower-layout">
        {/* Left: Subject Wise Performance Overview Table */}
        <div className="att-table-card">
          <div className="att-table-header">
            <h2>Subject Wise Performance Overview</h2>
          </div>

          <div className="att-table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Students Enrolled</th>
                  <th>Average Marks (out of 100)</th>
                  <th>Average Grade</th>
                  <th>Pass Percentage</th>
                  <th>Trend</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((s) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600, color: '#0b153b' }}>{s.name}</td>
                    <td style={{ color: '#475569' }}>{s.enrolled}</td>
                    <td style={{ fontWeight: 600, color: '#0b153b' }}>{s.avgMarks}</td>
                    <td>
                      <span className={`ins-grade-badge ${s.gradeClass}`}>{s.grade}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0b153b' }}>{s.passPct}%</td>
                    <td>
                      <svg className="ins-sparkline-svg" viewBox="0 0 60 20">
                        <polyline
                          className={`ins-sparkline-path ${s.trend === 'up' ? 'green' : 'orange'}`}
                          points={
                            s.trend === 'up'
                              ? '5,16 18,14 32,10 46,7 56,3'
                              : '5,5 18,6 32,12 46,14 56,12'
                          }
                        />
                      </svg>
                    </td>
                    <td>
                      <button
                        className="ins-table-action-btn"
                        onClick={() => setSelectedSubjectDetail(s)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="att-table-footer">
            <span>Showing 1 to {filteredSubjects.length} of 12 subjects</span>

            <div className="att-pagination-controls">
              <div className="att-rows-per-page">
                <span>Rows per page:</span>
                <select
                  className="att-rows-select"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>

              <div className="att-pages-list">
                <button className="att-page-nav-btn" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="att-page-num active">1</button>
                <button className="att-page-num">2</button>
                <button className="att-page-num">3</button>
                <button className="att-page-nav-btn">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: At Risk Students & Performance Insights */}
        <div className="att-sidebar">
          {/* Card A: At Risk Students */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>
                At Risk Students <span className="att-subtitle-badge">(Low Academic Performance)</span>
              </h3>
              <button
                className="att-link-view"
                onClick={() => notify('Opening full list of academic at-risk students.')}
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
                    <span>STU1008 • Mechanical Engg.</span>
                  </div>
                </div>
                <span className="att-low-pct-pill red">CGPA: 3.42</span>
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
                    <span>STU1003 • Electronics Engg.</span>
                  </div>
                </div>
                <span className="att-low-pct-pill red">CGPA: 3.65</span>
              </div>

              {/* Vivek Yadav */}
              <div className="att-low-student-item">
                <div className="att-low-student-left">
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
                    alt="Vivek Yadav"
                    className="att-stu-avatar"
                  />
                  <div className="att-low-student-info">
                    <h4>Vivek Yadav</h4>
                    <span>STU1007 • Electronics Engg.</span>
                  </div>
                </div>
                <span className="att-low-pct-pill red">CGPA: 3.78</span>
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
                    <span>STU1004 • Mechanical Engg.</span>
                  </div>
                </div>
                <span className="att-low-pct-pill amber">CGPA: 3.89</span>
              </div>

              {/* Karan Verma */}
              <div className="att-low-student-item">
                <div className="att-low-student-left">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Karan Verma"
                    className="att-stu-avatar"
                  />
                  <div className="att-low-student-info">
                    <h4>Karan Verma</h4>
                    <span>STU1005 • Computer Engg.</span>
                  </div>
                </div>
                <span className="att-low-pct-pill amber">CGPA: 4.12</span>
              </div>
            </div>
          </div>

          {/* Card B: Performance Insights */}
          <div className="ins-insight-card">
            <div className="ins-insight-icon">
              <Lightbulb size={20} />
            </div>
            <div className="ins-insight-text">
              <h4 style={{ margin: '0 0 4px 0', fontSize: 13, color: '#0b153b', fontWeight: 600 }}>
                Performance Insights
              </h4>
              <p>
                Students who attend classes regularly and submit assignments on time have 2.3x better academic performance.
              </p>
              <button
                className="ins-insight-link"
                onClick={() => notify('AI Academic Performance Correlation Analysis opened.')}
              >
                View Detailed Insights <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="att-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <Download size={18} style={{ color: '#2563eb' }} /> Export Academic Performance Report
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <p style={{ fontSize: 13, color: '#64748b' }}>
                Download comprehensive academic analytics including subject-wise marks, grades distribution, and pass percentages.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
                <div style={{ border: '1.5px solid #2563eb', background: '#eff6ff', borderRadius: 10, padding: 14 }}>
                  <b style={{ color: '#2563eb', fontSize: 13, display: 'block' }}>📊 Excel (.xlsx)</b>
                  <small style={{ color: '#64748b' }}>Complete grade book & mark sheets</small>
                </div>
                <div style={{ border: '1px solid #dce4f2', borderRadius: 10, padding: 14 }}>
                  <b style={{ color: '#0b153b', fontSize: 13, display: 'block' }}>📑 PDF Summary</b>
                  <small style={{ color: '#64748b' }}>Dean summary with charts</small>
                </div>
              </div>
            </div>
            <div className="att-modal-footer">
              <button className="btn-outline-action" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary-purple"
                style={{ background: '#2563eb' }}
                onClick={() => {
                  setShowExportModal(false);
                  notify('Academic_Performance_Report_2025.xlsx downloaded successfully.');
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {selectedSubjectDetail && (
        <div className="att-modal-overlay" onClick={() => setSelectedSubjectDetail(null)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <BookOpen size={18} style={{ color: '#2563eb' }} /> {selectedSubjectDetail.name} Analytics
              </h3>
              <button className="att-modal-close-btn" onClick={() => setSelectedSubjectDetail(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Enrolled</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#0b153b' }}>{selectedSubjectDetail.enrolled}</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Average Marks</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#2563eb' }}>{selectedSubjectDetail.avgMarks} / 100</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Pass Rate</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#10b981' }}>{selectedSubjectDetail.passPct}%</h4>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#475569' }}>
                Course evaluation shows consistent performance with highest scores in practical labs and midterm tests.
              </p>
            </div>
            <div className="att-modal-footer">
              <button className="btn-primary-purple" style={{ background: '#2563eb' }} onClick={() => setSelectedSubjectDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
