import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  MoreVertical,
  Activity,
  Award,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  PlayCircle,
  FileText,
  MessageSquare,
  PenTool
} from 'lucide-react';
import '../styles/attendance.css';
import '../styles/learning-insights.css';

const INITIAL_BEHAVIOR_STUDENTS = [
  {
    id: 'STU1001',
    name: 'Rahul Patel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    initials: 'RP',
    studyTime: '3h 10m',
    consistency: 82,
    engagement: 78,
    style: 'Visual Learner',
    styleClass: 'visual',
    riskLevel: 'Low',
    riskClass: 'green'
  },
  {
    id: 'STU1002',
    name: 'Sneha Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'SS',
    studyTime: '2h 25m',
    consistency: 74,
    engagement: 68,
    style: 'Auditory Learner',
    styleClass: 'auditory',
    riskLevel: 'Medium',
    riskClass: 'amber'
  },
  {
    id: 'STU1003',
    name: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    initials: 'AM',
    studyTime: '1h 45m',
    consistency: 58,
    engagement: 52,
    style: 'Read/Write Learner',
    styleClass: 'readwrite',
    riskLevel: 'High',
    riskClass: 'red'
  },
  {
    id: 'STU1004',
    name: 'Pooja Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    initials: 'PS',
    studyTime: '2h 55m',
    consistency: 80,
    engagement: 72,
    style: 'Visual Learner',
    styleClass: 'visual',
    riskLevel: 'Low',
    riskClass: 'green'
  },
  {
    id: 'STU1005',
    name: 'Karan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    initials: 'KV',
    studyTime: '1h 30m',
    consistency: 45,
    engagement: 45,
    style: 'Kinesthetic Learner',
    styleClass: 'kinesthetic',
    riskLevel: 'High',
    riskClass: 'red'
  }
];

export default function LearningBehaviorPage({ notify = () => {} }) {
  // Dropdowns & filters
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [subject, setSubject] = useState('All Subjects');
  const [timePeriod, setTimePeriod] = useState('This Month');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Table & modals
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [hoveredEngagementPoint, setHoveredEngagementPoint] = useState(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.att-dropdown-field') && !e.target.closest('.att-action-btn')) {
        setOpenDropdown(null);
        setActiveMenuId(null);
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
    'Database Mgmt.',
    'Digital Logic',
    'Operating Systems',
    'Web Development'
  ];

  const timeOptions = ['This Month', 'This Week', 'This Semester', 'Annual'];

  const handleClearFilters = () => {
    setDepartment('All Departments');
    setSemester('All Semesters');
    setSubject('All Subjects');
    setTimePeriod('This Month');
    notify('Learning behavior filters reset to default.');
  };

  // Engagement Trend Points
  const engagementPoints = [
    { date: '7 Apr', score: 61, x: 30, y: 78 },
    { date: '14 Apr', score: 63, x: 80, y: 74 },
    { date: '21 Apr', score: 65, x: 130, y: 70 },
    { date: '28 Apr', score: 66, x: 180, y: 68 },
    { date: '5 May', score: 69, x: 230, y: 62 },
    { date: '12 May', score: 68, x: 280, y: 64 }
  ];

  return (
    <div className="insights-page">
      {/* 1. Page Header */}
      <div className="ins-header">
        <div className="ins-title-group">
          <div className="ins-icon-badge purple">
            <Users size={26} />
          </div>
          <div>
            <h1>Learning Behavior</h1>
            <p>Understand and analyze student learning patterns, habits and engagement.</p>
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
        {/* Avg Study Time (Daily) */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title blue">Avg. Study Time (Daily)</span>
            <span className="ins-stat-value">2h 35m</span>
            <span className="ins-stat-subtext green">
              <TrendingUp size={12} /> 18% from last month
            </span>
          </div>
          <div className="ins-stat-icon-circle cyan">
            <Clock size={22} />
          </div>
        </div>

        {/* Learning Consistency */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title green">Learning Consistency</span>
            <span className="ins-stat-value">76%</span>
            <span className="ins-stat-subtext green">
              <TrendingUp size={12} /> 9% from last month
            </span>
          </div>
          <div className="ins-stat-icon-circle green">
            <BookOpen size={22} />
          </div>
        </div>

        {/* Engagement Score */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title amber">Engagement Score</span>
            <span className="ins-stat-value">
              68 <em>/ 100</em>
            </span>
            <span className="ins-stat-subtext green">
              <TrendingUp size={12} /> 7 points from last month
            </span>
          </div>
          <div className="ins-stat-icon-circle amber">
            <Target size={22} />
          </div>
        </div>

        {/* Active Learners */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title purple">Active Learners</span>
            <span className="ins-stat-value">3,856</span>
            <span className="ins-stat-subtext purple">72% of total students</span>
          </div>
          <div className="ins-stat-icon-circle purple">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* At Risk (Low Engagement) */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title red">At Risk (Low Engagement)</span>
            <span className="ins-stat-value">712</span>
            <span className="ins-stat-subtext red">13.2% of total students</span>
          </div>
          <div className="ins-stat-icon-circle red">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="ins-filter-bar">
        <div className="ins-filter-controls-4">
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
                      notify(`Department: ${opt}`);
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
                      notify(`Semester: ${opt}`);
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
                      notify(`Subject: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Period */}
          <div className="att-dropdown-field">
            <label>Time Period</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'time' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            >
              <span>{timePeriod}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'time' && (
              <div className="att-dropdown-menu">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${timePeriod === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setTimePeriod(opt);
                      setOpenDropdown(null);
                      notify(`Time period: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters button */}
          <button
            className="att-btn-filter"
            style={{ marginTop: 19 }}
            onClick={() => notify('Learning behavior metrics filtered.')}
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
        {/* Card 1: Learning Behavior Overview (Radar / Spider Web Chart) */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Learning Behavior Overview</h3>
          </div>

          <div className="ins-radar-container">
            <svg viewBox="0 0 260 200" className="ins-radar-svg">
              {/* Concentric pentagons */}
              <polygon
                points="130,25 215,68 185,152 75,152 45,68"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <polygon
                points="130,50 190,80 170,135 90,135 70,80"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <polygon
                points="130,75 165,95 152,122 108,122 95,95"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              {/* Axis lines from center (130, 95) */}
              <line x1="130" y1="95" x2="130" y2="25" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="130" y1="95" x2="215" y2="68" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="130" y1="95" x2="185" y2="152" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="130" y1="95" x2="75" y2="152" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="130" y1="95" x2="45" y2="68" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />

              {/* Past Month Average (Dashed polygon) */}
              <polygon
                className="ins-radar-polygon-past"
                points="130,45 180,82 165,138 88,138 65,82"
              />

              {/* This Month Average (Solid purple polygon) */}
              <polygon
                className="ins-radar-polygon"
                points="130,35 198,72 172,146 80,146 52,72"
              />

              {/* Node dots */}
              {[[130, 35], [198, 72], [172, 146], [80, 146], [52, 72]].map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#5247e6" />
              ))}

              {/* Axis labels */}
              <text x="130" y="16" textAnchor="middle" className="ins-radar-axis-text">Study Time</text>
              <text x="218" y="70" textAnchor="start" className="ins-radar-axis-text">Class Participation</text>
              <text x="188" y="166" textAnchor="middle" className="ins-radar-axis-text">Assignment Submission</text>
              <text x="70" y="166" textAnchor="middle" className="ins-radar-axis-text">Resource Utilization</text>
              <text x="42" y="70" textAnchor="end" className="ins-radar-axis-text">Self Learning</text>
            </svg>

            {/* Legend */}
            <div className="ins-radar-legend">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 3, background: '#5247e6', borderRadius: 2 }} />
                <b>This Month (Avg.)</b>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 2, borderTop: '2px dashed #94a3b8' }} />
                <span>Last Month (Avg.)</span>
              </span>
            </div>

            {/* Callout */}
            <div className="ins-radar-callout">
              <Sparkles size={14} style={{ color: '#7c3aed', flexShrink: 0 }} />
              <span>Students are spending more time on self learning and resource utilization.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Engagement Trend */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Engagement Trend</h3>
            <select className="att-time-select" defaultValue="This Month">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Semester</option>
            </select>
          </div>

          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <svg viewBox="0 0 310 140" className="att-trend-chart-svg">
              <g className="att-grid">
                <line x1="28" y1="18" x2="295" y2="18" className="att-grid-line" />
                <text x="5" y="21" className="att-axis-text">100</text>

                <line x1="28" y1="44" x2="295" y2="44" className="att-grid-line" />
                <text x="8" y="47" className="att-axis-text">75</text>

                <line x1="28" y1="70" x2="295" y2="70" className="att-grid-line" />
                <text x="8" y="73" className="att-axis-text">50</text>

                <line x1="28" y1="96" x2="295" y2="96" className="att-grid-line" />
                <text x="8" y="99" className="att-axis-text">25</text>

                <line x1="28" y1="120" x2="295" y2="120" className="att-grid-line" />
                <text x="14" y="123" className="att-axis-text">0</text>
              </g>

              {/* Gradient area */}
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="30,78 80,74 130,70 180,68 230,62 280,64 280,120 30,120"
                fill="url(#purpleGradient)"
              />

              {/* X-axis */}
              <g className="att-axis-x">
                {engagementPoints.map((p) => (
                  <text key={p.date} x={p.x - 10} y="134" className="att-axis-text">
                    {p.date}
                  </text>
                ))}
              </g>

              {/* Line */}
              <polyline
                className="att-trend-line"
                style={{ stroke: '#7c3aed' }}
                points="30,78 80,74 130,70 180,68 230,62 280,64"
              />

              {/* Dots */}
              {engagementPoints.map((p) => (
                <g key={p.date}>
                  <circle
                    className="att-trend-dot"
                    style={{ stroke: '#7c3aed' }}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    onMouseEnter={() => setHoveredEngagementPoint(p)}
                    onMouseLeave={() => setHoveredEngagementPoint(null)}
                  />
                  <text
                    x={p.x}
                    y={p.y - 7}
                    textAnchor="middle"
                    style={{ fontSize: 8.5, fontWeight: 700, fill: '#0b153b' }}
                  >
                    {p.score}
                  </text>
                </g>
              ))}
            </svg>

            <div className="att-trend-footer">
              <TrendingUp size={13} /> 10% improvement in engagement from last month
            </div>
          </div>
        </div>

        {/* Card 3: Learning Activity Distribution */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Learning Activity Distribution</h3>
          </div>

          <div className="ins-donut-center-group">
            <div className="ins-donut-center-box">
              <svg viewBox="0 0 100 100" className="ins-donut-center-svg">
                {/* Video Lectures (Purple): 35% = 74.7 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#7c3aed"
                  strokeDasharray="74.7 213.6"
                  strokeDashoffset="0"
                />
                {/* Reading Materials (Blue): 25% = 53.4 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#3b82f6"
                  strokeDasharray="53.4 213.6"
                  strokeDashoffset="-74.7"
                />
                {/* Practice & Quizzes (Green): 20% = 42.7 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#10b981"
                  strokeDasharray="42.7 213.6"
                  strokeDashoffset="-128.1"
                />
                {/* Assignments (Orange): 12% = 25.6 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#f97316"
                  strokeDasharray="25.6 213.6"
                  strokeDashoffset="-170.8"
                />
                {/* Discussions (Red/Pink): 8% = 17.2 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#f43f5e"
                  strokeDasharray="17.2 213.6"
                  strokeDashoffset="-196.4"
                />
              </svg>
              <div className="ins-donut-center-text">
                <small>Total</small>
                <b>5,400</b>
                <small>Activities</small>
              </div>
            </div>

            <div className="ins-donut-legend">
              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#7c3aed' }} />
                  <span>Video Lectures</span>
                </div>
                <div className="ins-donut-legend-stat">
                  35% <span>(1,890)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#3b82f6' }} />
                  <span>Reading Materials</span>
                </div>
                <div className="ins-donut-legend-stat">
                  25% <span>(1,350)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#10b981' }} />
                  <span>Practice & Quizzes</span>
                </div>
                <div className="ins-donut-legend-stat">
                  20% <span>(1,080)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#f97316' }} />
                  <span>Assignments</span>
                </div>
                <div className="ins-donut-legend-stat">
                  12% <span>(648)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#f43f5e' }} />
                  <span>Discussions</span>
                </div>
                <div className="ins-donut-legend-stat">
                  8% <span>(432)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="att-action-link"
            style={{ marginTop: 'auto' }}
            onClick={() => notify('Opening detailed activity analytics dashboard.')}
          >
            View Detailed Activity <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 5. Bottom Split Section */}
      <div className="ins-lower-layout">
        {/* Left: Student Learning Behavior Summary Table */}
        <div className="att-table-card">
          <div className="att-table-header">
            <h2>Student Learning Behavior Summary</h2>
          </div>

          <div className="att-table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Study Time (Daily)</th>
                  <th>Consistency</th>
                  <th>Engagement Score</th>
                  <th>Preferred Learning Style</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_BEHAVIOR_STUDENTS.map((stu) => {
                  const isMenuOpen = activeMenuId === stu.id;
                  const consistClass = stu.consistency >= 75 ? 'green' : stu.consistency >= 60 ? 'amber' : 'red';
                  const engageClass = stu.engagement >= 75 ? 'green' : stu.engagement >= 60 ? 'amber' : 'red';

                  return (
                    <tr key={stu.id}>
                      <td className="att-stu-id">{stu.id}</td>
                      <td>
                        <div className="att-stu-info">
                          <img src={stu.avatar} alt={stu.name} className="att-stu-avatar" />
                          <span className="att-stu-name">{stu.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0b153b' }}>{stu.studyTime}</td>
                      <td>
                        <div className="att-pct-cell">
                          <span className="att-pct-val">{stu.consistency}%</span>
                          <span className="att-progress-track">
                            <i className={`att-progress-fill ${consistClass}`} style={{ width: `${stu.consistency}%` }} />
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="att-pct-cell">
                          <span className="att-pct-val">{stu.engagement}/100</span>
                          <span className="att-progress-track">
                            <i className={`att-progress-fill ${engageClass}`} style={{ width: `${stu.engagement}%` }} />
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`ins-style-pill ${stu.styleClass}`}>
                          {stu.style === 'Visual Learner' && <Eye size={12} />}
                          {stu.style === 'Auditory Learner' && <PlayCircle size={12} />}
                          {stu.style === 'Read/Write Learner' && <BookOpen size={12} />}
                          {stu.style === 'Kinesthetic Learner' && <PenTool size={12} />}
                          {stu.style}
                        </span>
                      </td>
                      <td>
                        <span className={`att-badge-status ${stu.riskLevel.toLowerCase()}`}>
                          {stu.riskLevel}
                        </span>
                      </td>
                      <td style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            className="ins-table-action-btn"
                            onClick={() => setSelectedStudentDetail(stu)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="att-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : stu.id);
                            }}
                          >
                            <MoreVertical size={15} />
                          </button>
                        </div>

                        {isMenuOpen && (
                          <div className="att-row-menu">
                            <button onClick={() => setSelectedStudentDetail(stu)}>
                              <Eye size={13} style={{ color: '#7c3aed' }} /> View Learning Habit
                            </button>
                            <button onClick={() => notify(`Personalized study plan drafted for ${stu.name}.`)}>
                              <Sparkles size={13} style={{ color: '#2563eb' }} /> Suggest AI Plan
                            </button>
                            <button onClick={() => notify(`Mentor allocated for ${stu.name}.`)}>
                              <Award size={13} style={{ color: '#10b981' }} /> Assign Mentor
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

          {/* Table Footer */}
          <div className="att-table-footer">
            <span>Showing 1 to 5 of 5,420 students</span>

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
                <span className="att-page-dots">...</span>
                <button className="att-page-num">542</button>
                <button className="att-page-nav-btn">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Insights & Recommended Actions */}
        <div className="att-sidebar">
          {/* Card A: Key Insights */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>Key Insights</h3>
            </div>

            <div>
              <div
                className="ins-key-insight-row"
                onClick={() => notify('Research Study correlation: High study time = High GPA')}
              >
                <div className="ins-key-insight-left">
                  <TrendingUp size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  <p>Students who study more than 2 hours daily have 2.5x better academic performance.</p>
                </div>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
              </div>

              <div
                className="ins-key-insight-row"
                onClick={() => notify('Predictive model weight: Learning Consistency (0.42)')}
              >
                <div className="ins-key-insight-left">
                  <Clock size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <p>Consistency in learning is the top predictor of student success.</p>
                </div>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
              </div>

              <div
                className="ins-key-insight-row"
                onClick={() => notify('Engagement Boost Metric: Video Quizzes + Interactive Labs')}
              >
                <div className="ins-key-insight-left">
                  <Layers size={16} style={{ color: '#7c3aed', flexShrink: 0 }} />
                  <p>Interactive content boosts engagement by 35% on average.</p>
                </div>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
              </div>
            </div>
          </div>

          {/* Card B: Recommended Actions */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3 style={{ color: '#16a34a' }}>Recommended Actions</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <div className="ins-rec-action-item">
                <div className="ins-rec-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <Users size={13} />
                </div>
                <span>Encourage low engagement students with personalized plans</span>
              </div>

              <div className="ins-rec-action-item">
                <div className="ins-rec-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <Award size={13} />
                </div>
                <span>Assign mentors to high risk students</span>
              </div>

              <div className="ins-rec-action-item">
                <div className="ins-rec-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <Sparkles size={13} />
                </div>
                <span>Share engaging resources & interactive materials</span>
              </div>
            </div>

            <button
              className="att-action-link"
              onClick={() => notify('Opening Intervention Plans dashboard.')}
            >
              View Intervention Plans <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="att-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h3>
                <Download size={18} style={{ color: '#7c3aed' }} /> Export Learning Behavior Analytics
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <p style={{ fontSize: 13, color: '#64748b' }}>
                Download comprehensive behavioral data including daily study time logs, engagement trends, and learning styles.
              </p>
            </div>
            <div className="att-modal-footer">
              <button className="btn-outline-action" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary-purple"
                style={{ background: '#7c3aed' }}
                onClick={() => {
                  setShowExportModal(false);
                  notify('Learning_Behavior_Insights_May2025.xlsx downloaded.');
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Behavior Modal */}
      {selectedStudentDetail && (
        <div className="att-modal-overlay" onClick={() => setSelectedStudentDetail(null)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={selectedStudentDetail.avatar} alt="" className="att-stu-avatar" style={{ width: 38, height: 38 }} />
                <div>
                  <h3 style={{ margin: 0 }}>{selectedStudentDetail.name}</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{selectedStudentDetail.id} • {selectedStudentDetail.style}</span>
                </div>
              </div>
              <button className="att-modal-close-btn" onClick={() => setSelectedStudentDetail(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Daily Study Time</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#0b153b' }}>{selectedStudentDetail.studyTime}</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Consistency</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#10b981' }}>{selectedStudentDetail.consistency}%</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Engagement Score</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#7c3aed' }}>{selectedStudentDetail.engagement} / 100</h4>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#475569' }}>
                AI Recommendation: Student excels when presented with visual flowcharts and video lessons. Weekly active engagement has improved by 14%.
              </p>
            </div>
            <div className="att-modal-footer">
              <button className="btn-primary-purple" style={{ background: '#7c3aed' }} onClick={() => setSelectedStudentDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
