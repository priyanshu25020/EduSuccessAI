import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  HeartHandshake,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  GraduationCap,
  IndianRupee,
  Award,
  User,
  Home,
  Laptop,
  Lightbulb,
  ArrowRight,
  X,
  HandHeart,
  FileSpreadsheet
} from 'lucide-react';
import '../styles/attendance.css';
import '../styles/learning-insights.css';

const INITIAL_SOCIO_STUDENTS = [
  {
    id: 'STU1001',
    name: 'Rahul Patel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    dept: 'Computer Engg.',
    semester: 4,
    riskLevel: 'High Risk',
    riskClass: 'red',
    income: '< ₹1,00,000',
    education: 'Up to 10th',
    location: 'Rural'
  },
  {
    id: 'STU1002',
    name: 'Sneha Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dept: 'Information Tech.',
    semester: 4,
    riskLevel: 'Medium Risk',
    riskClass: 'amber',
    income: '₹1,00,000 - ₹2,00,000',
    education: '12th',
    location: 'Semi-Urban'
  },
  {
    id: 'STU1003',
    name: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dept: 'Electronics Engg.',
    semester: 4,
    riskLevel: 'Low Risk',
    riskClass: 'green',
    income: '> ₹2,00,000',
    education: 'Graduate',
    location: 'Urban'
  },
  {
    id: 'STU1004',
    name: 'Pooja Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dept: 'Mechanical Engg.',
    semester: 4,
    riskLevel: 'High Risk',
    riskClass: 'red',
    income: '< ₹1,00,000',
    education: 'Up to 10th',
    location: 'Rural'
  },
  {
    id: 'STU1005',
    name: 'Karan Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    dept: 'Civil Engg.',
    semester: 6,
    riskLevel: 'Medium Risk',
    riskClass: 'amber',
    income: '₹1,00,000 - ₹2,00,000',
    education: '12th',
    location: 'Semi-Urban'
  }
];

export default function SocioEconomicFactorsPage({ notify = () => {} }) {
  // Dropdown states
  const [department, setDepartment] = useState('All Departments');
  const [semester, setSemester] = useState('All Semesters');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [location, setLocation] = useState('All Locations');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination & Modals
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [trendTimeframe, setTrendTimeframe] = useState('This Month');

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

  const yearOptions = ['2024-25', '2023-24', '2022-23'];
  const riskOptions = ['All Risk Levels', 'Low Risk', 'Medium Risk', 'High Risk', 'Needs Immediate Support'];
  const locationOptions = ['All Locations', 'Rural', 'Semi-Urban', 'Urban'];

  const filteredStudents = useMemo(() => {
    return INITIAL_SOCIO_STUDENTS.filter((stu) => {
      if (department !== 'All Departments' && stu.dept !== department) return false;
      if (riskFilter !== 'All Risk Levels' && stu.riskLevel !== riskFilter) return false;
      if (location !== 'All Locations' && stu.location !== location) return false;
      return true;
    });
  }, [department, riskFilter, location]);

  const handleClearFilters = () => {
    setDepartment('All Departments');
    setSemester('All Semesters');
    setAcademicYear('2024-25');
    setRiskFilter('All Risk Levels');
    setLocation('All Locations');
    notify('Socio-economic factor filters reset to default.');
  };

  return (
    <div className="insights-page">
      {/* 1. Page Header */}
      <div className="ins-header">
        <div className="ins-title-group">
          <div className="ins-icon-badge purple">
            <Users size={26} />
          </div>
          <div>
            <h1>Socio-economic Factors</h1>
            <p>Track and analyze socio-economic backgrounds to identify students who may need additional support.</p>
          </div>
        </div>

        <div className="ins-actions">
          <button className="btn-outline-action" onClick={() => setShowExportModal(true)}>
            <Download size={15} /> Export Report
          </button>
          <button className="btn-outline-action" onClick={() => notify('Advanced demographic filters drawer opened.')}>
            <Filter size={15} /> Filters
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="ins-stats-4">
        {/* Low Socio-economic Risk */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title blue">Low Socio-economic Risk</span>
            <span className="ins-stat-value">2,148</span>
            <span className="ins-stat-subtext blue">39.6% of total students</span>
          </div>
          <div className="ins-stat-icon-circle blue">
            <ShieldCheck size={22} />
          </div>
          <div className="bottom-bar-indicator purple" />
        </div>

        {/* Medium Socio-economic Risk */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title green">Medium Socio-economic Risk</span>
            <span className="ins-stat-value">2,376</span>
            <span className="ins-stat-subtext green">43.8% of total students</span>
          </div>
          <div className="ins-stat-icon-circle green">
            <Users size={22} />
          </div>
          <div className="bottom-bar-indicator green" />
        </div>

        {/* High Socio-economic Risk */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title amber">High Socio-economic Risk</span>
            <span className="ins-stat-value">896</span>
            <span className="ins-stat-subtext amber">16.5% of total students</span>
          </div>
          <div className="ins-stat-icon-circle amber">
            <AlertTriangle size={22} />
          </div>
          <div className="bottom-bar-indicator amber" />
        </div>

        {/* Needs Immediate Support */}
        <div className="ins-stat-card">
          <div className="ins-stat-info">
            <span className="ins-stat-title blue">Needs Immediate Support</span>
            <span className="ins-stat-value">214</span>
            <span className="ins-stat-subtext blue">3.9% of total students</span>
          </div>
          <div className="ins-stat-icon-circle cyan">
            <HeartHandshake size={22} />
          </div>
          <div className="bottom-bar-indicator blue" />
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
                      notify(`Academic Year: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Socio-economic Risk Level */}
          <div className="att-dropdown-field">
            <label>Socio-economic Risk Level</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'risk' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'risk' ? null : 'risk')}
            >
              <span>{riskFilter}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'risk' && (
              <div className="att-dropdown-menu">
                {riskOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${riskFilter === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setRiskFilter(opt);
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

          {/* Location */}
          <div className="att-dropdown-field">
            <label>Location</label>
            <button
              className={`att-dropdown-btn ${openDropdown === 'loc' ? 'active' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'loc' ? null : 'loc')}
            >
              <span>{location}</span>
              <ChevronDown size={14} className="chevron" />
            </button>

            {openDropdown === 'loc' && (
              <div className="att-dropdown-menu">
                {locationOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`att-dropdown-item ${location === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setLocation(opt);
                      setOpenDropdown(null);
                      notify(`Location: ${opt}`);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="att-clear-btn" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

      {/* 4. Middle 3-Column Section */}
      <div className="ins-grid-3">
        {/* Card 1: Socio-economic Risk Distribution */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Socio-economic Risk Distribution</h3>
          </div>

          <div className="ins-donut-center-group">
            <div className="ins-donut-center-box">
              <svg viewBox="0 0 100 100" className="ins-donut-center-svg">
                {/* Low Risk (Green): 39.6% = 84.5 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#10b981"
                  strokeDasharray="84.5 213.6"
                  strokeDashoffset="0"
                />
                {/* Medium Risk (Yellow): 43.8% = 93.5 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#f59e0b"
                  strokeDasharray="93.5 213.6"
                  strokeDashoffset="-84.5"
                />
                {/* High Risk (Red): 16.5% = 35.2 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#ef4444"
                  strokeDasharray="35.2 213.6"
                  strokeDashoffset="-178.0"
                />
                {/* Needs Immediate Support (Purple): 3.9% = 8.3 */}
                <circle
                  className="att-donut-slice"
                  cx="50"
                  cy="50"
                  r="34"
                  stroke="#8b5cf6"
                  strokeDasharray="8.3 213.6"
                  strokeDashoffset="-213.2"
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
                  <span>Low Risk</span>
                </div>
                <div className="ins-donut-legend-stat">
                  2,148 <span>(39.6%)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#f59e0b' }} />
                  <span>Medium Risk</span>
                </div>
                <div className="ins-donut-legend-stat">
                  2,376 <span>(43.8%)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#ef4444' }} />
                  <span>High Risk</span>
                </div>
                <div className="ins-donut-legend-stat">
                  896 <span>(16.5%)</span>
                </div>
              </div>

              <div className="ins-donut-legend-item">
                <div className="ins-donut-legend-left">
                  <span className="ins-donut-legend-dot" style={{ background: '#8b5cf6' }} />
                  <span>Needs Immediate Support</span>
                </div>
                <div className="ins-donut-legend-stat">
                  214 <span>(3.9%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Socio-economic Risk by Department (Stacked Horizontal Bars) */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Socio-economic Risk by Department</h3>
          </div>

          <div style={{ display: 'flex', gap: 14, fontSize: 10, marginBottom: 8, justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Low Risk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> Medium Risk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> High Risk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} /> Needs Support
            </span>
          </div>

          <div className="ins-stacked-dept-list">
            {/* Computer Engg. */}
            <div className="ins-stacked-dept-row">
              <span className="ins-stacked-dept-label">Computer Engg.</span>
              <div className="ins-stacked-track">
                <div className="ins-stacked-segment green" style={{ width: '42%' }}>42%</div>
                <div className="ins-stacked-segment yellow" style={{ width: '44%' }}>44%</div>
                <div className="ins-stacked-segment red" style={{ width: '11%' }}>11%</div>
                <div className="ins-stacked-segment purple" style={{ width: '3%' }}>3%</div>
              </div>
            </div>

            {/* Information Tech. */}
            <div className="ins-stacked-dept-row">
              <span className="ins-stacked-dept-label">Information Tech.</span>
              <div className="ins-stacked-track">
                <div className="ins-stacked-segment green" style={{ width: '38%' }}>38%</div>
                <div className="ins-stacked-segment yellow" style={{ width: '45%' }}>45%</div>
                <div className="ins-stacked-segment red" style={{ width: '13%' }}>13%</div>
                <div className="ins-stacked-segment purple" style={{ width: '4%' }}>4%</div>
              </div>
            </div>

            {/* Electronics Engg. */}
            <div className="ins-stacked-dept-row">
              <span className="ins-stacked-dept-label">Electronics Engg.</span>
              <div className="ins-stacked-track">
                <div className="ins-stacked-segment green" style={{ width: '36%' }}>36%</div>
                <div className="ins-stacked-segment yellow" style={{ width: '42%' }}>42%</div>
                <div className="ins-stacked-segment red" style={{ width: '17%' }}>17%</div>
                <div className="ins-stacked-segment purple" style={{ width: '5%' }}>5%</div>
              </div>
            </div>

            {/* Mechanical Engg. */}
            <div className="ins-stacked-dept-row">
              <span className="ins-stacked-dept-label">Mechanical Engg.</span>
              <div className="ins-stacked-track">
                <div className="ins-stacked-segment green" style={{ width: '40%' }}>40%</div>
                <div className="ins-stacked-segment yellow" style={{ width: '41%' }}>41%</div>
                <div className="ins-stacked-segment red" style={{ width: '15%' }}>15%</div>
                <div className="ins-stacked-segment purple" style={{ width: '4%' }}>4%</div>
              </div>
            </div>

            {/* Civil Engg. */}
            <div className="ins-stacked-dept-row">
              <span className="ins-stacked-dept-label">Civil Engg.</span>
              <div className="ins-stacked-track">
                <div className="ins-stacked-segment green" style={{ width: '30%' }}>30%</div>
                <div className="ins-stacked-segment yellow" style={{ width: '47%' }}>47%</div>
                <div className="ins-stacked-segment red" style={{ width: '17%' }}>17%</div>
                <div className="ins-stacked-segment purple" style={{ width: '6%' }}>6%</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#94a3b8', marginTop: 10, paddingLeft: 120 }}>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Card 3: Key Socio-economic Factors */}
        <div className="ins-card">
          <div className="ins-card-head">
            <h3>Key Socio-economic Factors</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {/* Parental Education */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <GraduationCap size={15} />
                </div>
                <span className="ins-factor-name">Parental Education (Low)</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '52%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">52%</span>
            </div>

            {/* Family Income */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <IndianRupee size={15} />
                </div>
                <span className="ins-factor-name">Family Income (Low)</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '48%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">48%</span>
            </div>

            {/* First Generation Learners */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Award size={15} />
                </div>
                <span className="ins-factor-name">First Generation Learners</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '41%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">41%</span>
            </div>

            {/* Single Parent Family */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
                  <User size={15} />
                </div>
                <span className="ins-factor-name">Single Parent Family</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">18%</span>
            </div>

            {/* Rural Background */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Home size={15} />
                </div>
                <span className="ins-factor-name">Rural Background</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">35%</span>
            </div>

            {/* Access to Learning Resources */}
            <div className="ins-factor-row">
              <div className="ins-factor-left">
                <div className="ins-factor-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <Laptop size={15} />
                </div>
                <span className="ins-factor-name">Access to Learning Resources</span>
              </div>
              <div className="ins-factor-bar-box">
                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '47%', height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                </div>
              </div>
              <span className="ins-factor-pct">47%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Split Section */}
      <div className="ins-lower-layout">
        {/* Left: Students by Socio-economic Risk Table */}
        <div className="att-table-card">
          <div className="att-table-header">
            <h2>Students by Socio-economic Risk</h2>
          </div>

          <div className="att-table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Risk Level</th>
                  <th>Family Income</th>
                  <th>Parental Education</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stu) => {
                  const isMenuOpen = activeMenuId === stu.id;

                  return (
                    <tr key={stu.id}>
                      <td className="att-stu-id">{stu.id}</td>
                      <td>
                        <div className="att-stu-info">
                          <img src={stu.avatar} alt={stu.name} className="att-stu-avatar" />
                          <span className="att-stu-name">{stu.name}</span>
                        </div>
                      </td>
                      <td>{stu.dept}</td>
                      <td>{stu.semester}</td>
                      <td>
                        <span className={`att-badge-status ${stu.riskClass}`}>
                          {stu.riskLevel}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0b153b' }}>{stu.income}</td>
                      <td style={{ color: '#475569' }}>{stu.education}</td>
                      <td style={{ color: '#475569' }}>{stu.location}</td>
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
                              <Eye size={13} style={{ color: '#7c3aed' }} /> View Full Profile
                            </button>
                            <button onClick={() => notify(`Scholarship grant assistance initiated for ${stu.name}.`)}>
                              <IndianRupee size={13} style={{ color: '#10b981' }} /> Recommend Scholarship
                            </button>
                            <button onClick={() => notify(`Hardware lending request logged for ${stu.name}.`)}>
                              <Laptop size={13} style={{ color: '#2563eb' }} /> Provide Device Support
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

        {/* Right: Socio-economic Risk Trend & Insights */}
        <div className="att-sidebar">
          {/* Card A: Socio-economic Risk Trend */}
          <div className="att-sidebar-card">
            <div className="att-card-head">
              <h3>Socio-economic Risk Trend</h3>
              <select className="att-time-select" defaultValue="This Month">
                <option>This Month</option>
                <option>Annual</option>
              </select>
            </div>

            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 310 135" className="att-trend-chart-svg">
                <g className="att-grid">
                  <line x1="28" y1="18" x2="295" y2="18" className="att-grid-line" />
                  <text x="5" y="21" className="att-axis-text">1000</text>

                  <line x1="28" y1="44" x2="295" y2="44" className="att-grid-line" />
                  <text x="8" y="47" className="att-axis-text">750</text>

                  <line x1="28" y1="70" x2="295" y2="70" className="att-grid-line" />
                  <text x="8" y="73" className="att-axis-text">500</text>

                  <line x1="28" y1="96" x2="295" y2="96" className="att-grid-line" />
                  <text x="8" y="99" className="att-axis-text">250</text>
                </g>

                {/* X-axis */}
                <g className="att-axis-x">
                  <text x="25" y="128" className="att-axis-text">20 Apr</text>
                  <text x="80" y="128" className="att-axis-text">27 Apr</text>
                  <text x="135" y="128" className="att-axis-text">4 May</text>
                  <text x="190" y="128" className="att-axis-text">11 May</text>
                  <text x="245" y="128" className="att-axis-text">18 May</text>
                </g>

                {/* Low Risk (Green) */}
                <polyline
                  className="att-trend-line"
                  style={{ stroke: '#10b981' }}
                  points="35,46 90,44 145,36 200,38 255,32"
                />
                {[[35, 46], [90, 44], [145, 36], [200, 38], [255, 32]].map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#10b981" />
                ))}

                {/* Medium Risk (Yellow) */}
                <polyline
                  className="att-trend-line"
                  style={{ stroke: '#f59e0b' }}
                  points="35,66 90,64 145,58 200,58 255,54"
                />
                {[[35, 66], [90, 64], [145, 58], [200, 58], [255, 54]].map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#f59e0b" />
                ))}

                {/* High Risk (Red) */}
                <polyline
                  className="att-trend-line"
                  style={{ stroke: '#ef4444' }}
                  points="35,90 90,88 145,88 200,88 255,87"
                />
                {[[35, 90], [90, 88], [145, 88], [200, 88], [255, 87]].map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#ef4444" />
                ))}

                {/* Needs Support (Purple) */}
                <polyline
                  className="att-trend-line"
                  style={{ stroke: '#7c3aed' }}
                  points="35,104 90,103 145,102 200,102 255,101"
                />
                {[[35, 104], [90, 103], [145, 102], [200, 102], [255, 101]].map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#7c3aed" />
                ))}
              </svg>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 10, marginTop: 6, justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Low Risk
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} /> Medium Risk
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} /> High Risk
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed' }} /> Needs Support
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Insights */}
          <div className="ins-insight-card">
            <div className="ins-insight-icon">
              <Lightbulb size={20} />
            </div>
            <div className="ins-insight-text">
              <h4 style={{ margin: '0 0 4px 0', fontSize: 13, color: '#0b153b', fontWeight: 600 }}>
                Insights
              </h4>
              <p>
                Students from low income families are 2.3x more likely to be at academic risk.
              </p>
              <button
                className="ins-insight-link"
                onClick={() => notify('Financial aid & academic support correlation dashboard.')}
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
                <Download size={18} style={{ color: '#7c3aed' }} /> Export Socio-Economic Analytics
              </h3>
              <button className="att-modal-close-btn" onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <p style={{ fontSize: 13, color: '#64748b' }}>
                Download socio-demographic distribution, financial assistance recommendations, and departmental risk heatmaps.
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
                  notify('SocioEconomic_Factors_Report_2025.xlsx downloaded.');
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="att-modal-overlay" onClick={() => setSelectedStudentDetail(null)}>
          <div className="att-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={selectedStudentDetail.avatar} alt="" className="att-stu-avatar" style={{ width: 38, height: 38 }} />
                <div>
                  <h3 style={{ margin: 0 }}>{selectedStudentDetail.name}</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{selectedStudentDetail.id} • {selectedStudentDetail.dept}</span>
                </div>
              </div>
              <button className="att-modal-close-btn" onClick={() => setSelectedStudentDetail(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="att-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Income Bracket</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#0b153b', fontSize: 13 }}>{selectedStudentDetail.income}</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Parent Education</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#0b153b', fontSize: 13 }}>{selectedStudentDetail.education}</h4>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>Location</small>
                  <h4 style={{ margin: '4px 0 0 0', color: '#7c3aed', fontSize: 13 }}>{selectedStudentDetail.location}</h4>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#475569' }}>
                Assistance recommendation: Eligible for Departmental Merit-cum-Means scholarship & Free Textbook Library access.
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
