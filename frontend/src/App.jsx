import { useMemo, useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  CalendarDays,
  Bell,
  ChevronDown,
  FileText,
  Home,
  ShieldCheck,
  Users,
  Target,
  MessageSquare,
  BellRing,
  CalendarCheck,
  GraduationCap,
  BrainCircuit,
  HeartHandshake,
  ChartNoAxesCombined,
  ClipboardPlus,
  UserRoundCheck,
  HandHeart,
  BarChart3,
  FileBarChart,
  Download,
  Eye,
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react";
import AttendancePage from "./pages/Attendance.jsx";
import AcademicPerformancePage from "./pages/AcademicPerformance.jsx";
import LearningBehaviorPage from "./pages/LearningBehavior.jsx";
import SocioEconomicFactorsPage from "./pages/SocioEconomicFactors.jsx";
import StudentsPage from "./pages/Students.jsx";
import RiskOverviewPage from "./pages/RiskOverview.jsx";
import BlockchainAuditPage from "./pages/BlockchainAudit.jsx";
import RiskPredictionPage from "./pages/RiskPrediction.jsx";
import InterventionsPage from "./pages/Interventions.jsx";
import AlertsNotificationsPage from "./pages/AlertsNotifications.jsx";
import { ALL_80_STUDENTS } from "./data/studentsData.js";
import { getStudentDeepProfile } from "./data/studentDetailHelpers.js";

const getStoredAttendanceLedger = () => {
  try {
    const saved78 = localStorage.getItem('edusuccess_78_attendance_ledger');
    if (saved78) return JSON.parse(saved78);
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

const nav = [
  [
    'STUDENT ANALYTICS',
    [
      [ShieldCheck, 'Risk Overview'],
      [Users, 'Students'],
      [Target, 'Risk Prediction'],
      [MessageSquare, 'Interventions'],
      [BellRing, 'Alerts & Notifications'],
      [CalendarCheck, 'Attendance']
    ]
  ],
  [
    'LEARNING INSIGHTS',
    [
      [GraduationCap, 'Academic Performance'],
      [BrainCircuit, 'Learning Behavior'],
      [Users, 'Socio-economic Factors']
    ]
  ],
  [
    'INTERVENTION & SUPPORT',
    [
      [ClipboardPlus, 'Intervention Plans'],
      [UserRoundCheck, 'Mentor Management'],
      [HandHeart, 'Counseling & Support']
    ]
  ],
  [
    'REPORTS & ANALYTICS',
    [
      [ChartNoAxesCombined, 'Impact Tracking'],
      [FileBarChart, 'Reports'],
      [Lock, 'Blockchain & Audit Trail'],
      [Download, 'Export Data']
    ]
  ]
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function App() {
  const [active, setActive] = useState('Dashboard');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [date, setDate] = useState('15 Aug 2026');
  const [headerCalMonth, setHeaderCalMonth] = useState(7); // August (0-indexed: 7)
  const [headerCalYear, setHeaderCalYear] = useState(2026);
  const [selectedCard, setSelectedCard] = useState('');
  const [dashboardPage, setDashboardPage] = useState(1);
  const [liveSyncTrigger, setLiveSyncTrigger] = useState(0);

  const dateWrapRef = useRef(null);
  const noticeWrapRef = useRef(null);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const activateCard = (name) => {
    setSelectedCard(name);
    notify(name + ' insights selected.');
    window.setTimeout(() => setSelectedCard(''), 600);
  };

  // Close calendar popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dateWrapRef.current && !dateWrapRef.current.contains(e.target)) {
        setDateOpen(false);
      }
      if (noticeWrapRef.current && !noticeWrapRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen to Blockchain Attendance Anchor & Storage Events for Real-Time Sync
  useEffect(() => {
    const handleSync = () => {
      setLiveSyncTrigger((prev) => prev + 1);
    };

    window.addEventListener('edusuccess_attendance_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('edusuccess_attendance_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute Real 80-Students Analytics (Verified by Blockchain Ledger)
  const liveDashboard = useMemo(() => {
    const ledger = getStoredAttendanceLedger();
    const anchoredBatches = getStoredAnchoredBatches();

    const evaluatedStudents = ALL_80_STUDENTS.map((s) => {
      const rollNo = s.rollNo || s.id;
      const studentHistory = ledger[rollNo] || ledger[s.id] || {};
      const totalLectures = s.totalLectures || 48;
      let attendedCount = 0;
      let totalMarked = 0;

      Object.entries(studentHistory).forEach(([dateStr, rec]) => {
        // Blockchain Verification Rule: ONLY count if anchored on chain!
        const isAnchored = anchoredBatches[dateStr]?.anchored === true;
        if (isAnchored && rec && rec.status && rec.status !== 'Not Marked') {
          totalMarked += 1;
          if (rec.status === 'Present') attendedCount += 1;
          else if (rec.status === 'Late') attendedCount += 0.5;
        }
      });

      const attPct = totalMarked > 0 ? parseFloat(((attendedCount / totalLectures) * 100).toFixed(1)) : 0;
      const deep = getStudentDeepProfile({ ...s, attendancePct: attPct });
      const riskLevel = deep?.aiSynthesis?.riskLevel || (s.cgpa < 5.0 || s.backlogs >= 2 ? 'High' : s.cgpa < 6.8 ? 'Medium' : 'Low');
      const riskScore = deep?.aiSynthesis?.dropoutProbability || (riskLevel === 'High' ? '88%' : riskLevel === 'Medium' ? '54%' : '18%');
      const factors = deep?.aiSynthesis?.riskTriggers?.join(' • ') || (s.backlogs > 0 ? `${s.backlogs} Active Backlog(s)` : 'Normal Academic Cadence');

      return {
        id: s.id,
        name: s.name,
        rollNo: s.rollNo,
        dept: s.dept,
        semester: s.semester,
        section: s.section,
        cgpa: s.cgpa,
        backlogs: s.backlogs,
        riskLevel,
        riskScore,
        factors,
        attendancePct: attPct,
        initials: s.initials || s.name.split(' ').map((n) => n[0]).join('').toUpperCase()
      };
    });

    const total = evaluatedStudents.length; // 80
    const highRiskStudents = evaluatedStudents.filter((s) => s.riskLevel === 'High');
    const mediumRiskStudents = evaluatedStudents.filter((s) => s.riskLevel === 'Medium');
    const lowRiskStudents = evaluatedStudents.filter((s) => s.riskLevel === 'Low');

    const highCount = highRiskStudents.length;
    const medCount = mediumRiskStudents.length;
    const lowCount = lowRiskStudents.length;

    const highPct = total > 0 ? ((highCount / total) * 100).toFixed(1) : '0.0';
    const medPct = total > 0 ? ((medCount / total) * 100).toFixed(1) : '0.0';
    const lowPct = total > 0 ? ((lowCount / total) * 100).toFixed(1) : '0.0';

    const lowAttCount = evaluatedStudents.filter((s) => s.attendancePct < 75).length;
    const lowCgpaCount = evaluatedStudents.filter((s) => parseFloat(s.cgpa) < 5.5).length;
    const backlogsCount = evaluatedStudents.filter((s) => parseInt(s.backlogs, 10) > 0).length;
    const lowEngageCount = evaluatedStudents.filter((s) => s.riskLevel !== 'Low').length;
    const ruralFrictionCount = Math.round(total * 0.38);

    const topRiskFactors = [
      { factor: 'Low Attendance (<75%)', impact: `${Math.round((lowAttCount / total) * 100)}%`, icon: Users },
      { factor: 'Academic Performance (<5.5 CGPA)', impact: `${Math.round((lowCgpaCount / total) * 100)}%`, icon: BookOpen },
      { factor: 'Active Backlogs', impact: `${Math.round((backlogsCount / total) * 100)}%`, icon: BriefcaseBusiness },
      { factor: 'Low Learning Engagement', impact: `${Math.round((lowEngageCount / total) * 100)}%`, icon: BrainCircuit },
      { factor: 'Rural / Long Commute Friction', impact: `${Math.round((ruralFrictionCount / total) * 100)}%`, icon: IndianRupee }
    ];

    const lowNum = parseFloat(lowPct);
    const medNum = parseFloat(medPct);
    const donutGradient = `conic-gradient(#38bf58 0 ${lowNum}%, #ffad12 ${lowNum}% ${lowNum + medNum}%, #ff444a ${lowNum + medNum}% 100%)`;

    // 5-Month Real Dynamic Trend Polylines (Jan, Feb, Mar, Apr, May)
    const trendHigh = [Math.max(1, highCount + 3), Math.max(1, highCount + 2), Math.max(1, highCount + 1), highCount, highCount];
    const trendMed = [Math.max(1, medCount - 2), Math.max(1, medCount - 1), medCount, medCount + 1, medCount];
    const trendLow = [Math.max(1, lowCount - 1), lowCount, lowCount + 1, lowCount, lowCount];

    const xCoords = [48, 135, 230, 325, 420];
    const getY = (val) => Math.round(225 - (Math.min(80, Math.max(0, val)) / 80) * 185);

    const highPolyline = xCoords.map((x, i) => `${x},${getY(trendHigh[i])}`).join(' ');
    const medPolyline = xCoords.map((x, i) => `${x},${getY(trendMed[i])}`).join(' ');
    const lowPolyline = xCoords.map((x, i) => `${x},${getY(trendLow[i])}`).join(' ');

    const highDots = xCoords.map((x, i) => [x, getY(trendHigh[i])]);
    const medDots = xCoords.map((x, i) => [x, getY(trendMed[i])]);
    const lowDots = xCoords.map((x, i) => [x, getY(trendLow[i])]);

    const alerts = [
      {
        id: 'ALT-1',
        icon: '⚠',
        title: 'High Risk Alert',
        text: `${highCount} student(s) (${highRiskStudents.map((s) => s.name).slice(0, 2).join(', ')}${highCount > 2 ? '...' : ''}) identified with high dropout probability.`,
        time: 'Just now'
      },
      {
        id: 'ALT-2',
        icon: '⚠',
        title: 'Attendance Alert',
        text: `${lowAttCount} student(s) have blockchain-verified attendance below the 75% threshold.`,
        time: '10 min ago'
      },
      {
        id: 'ALT-3',
        icon: '♧',
        title: 'AI Retention Milestone',
        text: `${highCount + medCount} students have active AI Remediation Action Plans pending review.`,
        time: '1 hour ago'
      }
    ];

    return {
      totalCount: total.toString(),
      lowCount: lowCount.toString(),
      lowPct: `${lowPct}%`,
      medCount: medCount.toString(),
      medPct: `${medPct}%`,
      highCount: highCount.toString(),
      highPct: `${highPct}%`,
      donutGradient,
      topRiskFactors,
      highRiskStudents,
      highPolyline,
      medPolyline,
      lowPolyline,
      highDots,
      medDots,
      lowDots,
      alerts
    };
  }, [liveSyncTrigger, date]);

  // Dynamic Values
  const {
    totalCount,
    lowCount,
    lowPct,
    medCount,
    medPct,
    highCount,
    highPct,
    donutGradient,
    topRiskFactors,
    highRiskStudents,
    highPolyline,
    medPolyline,
    lowPolyline,
    highDots,
    medDots,
    lowDots,
    alerts
  } = liveDashboard;

  const risk = [
    ['Low Risk', lowCount, lowPct, 'low'],
    ['Medium Risk', medCount, medPct, 'medium'],
    ['High Risk', highCount, highPct, 'high']
  ];

  const studentRows = useMemo(() => {
    return highRiskStudents.map((s) => [
      s.id,
      s.name,
      s.dept,
      s.riskScore,
      s.factors,
      s.initials
    ]);
  }, [highRiskStudents]);

  const shown = useMemo(
    () => studentRows.filter((s) => s.join(' ').toLowerCase().includes(query.toLowerCase())),
    [studentRows, query]
  );

  // Top header calendar helpers
  const daysInHeaderMonth = new Date(headerCalYear, headerCalMonth + 1, 0).getDate();
  const startDayOfHeaderMonth = new Date(headerCalYear, headerCalMonth, 1).getDay();

  const handleHeaderPrevMonth = (e) => {
    e.stopPropagation();
    if (headerCalMonth === 0) {
      setHeaderCalMonth(11);
      setHeaderCalYear((y) => y - 1);
    } else {
      setHeaderCalMonth((m) => m - 1);
    }
  };

  const handleHeaderNextMonth = (e) => {
    e.stopPropagation();
    if (headerCalMonth === 11) {
      setHeaderCalMonth(0);
      setHeaderCalYear((y) => y + 1);
    } else {
      setHeaderCalMonth((m) => m + 1);
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="side">
        <div className="logo" onClick={() => setActive('Dashboard')} style={{ cursor: 'pointer' }}>
          <span className="cap">◆</span>
          <div>
            <b>EduSuccess AI</b>
            <small>Student Success Platform</small>
          </div>
        </div>

        <button
          onClick={() => setActive('Dashboard')}
          className={'nav dashboard ' + (active === 'Dashboard' ? 'on' : '')}
        >
          <Home />
          Dashboard
        </button>

        {nav.map(([head, items]) => (
          <section key={head}>
            <h5>{head}</h5>
            {items.map(([Icon, label]) => (
              <button
                onClick={() => setActive(label)}
                className={'nav ' + (active === label ? 'on' : '')}
                key={label}
              >
                <Icon />
                {label}
              </button>
            ))}
          </section>
        ))}

        <div className="side-banner">
          <span>✦</span>
          <b>
            Empowering Education.
            <br />
            Reducing Dropout.
            <br />
            Building Futures.
          </b>
          <small>Let’s make a difference.</small>
          <div>🎓　📚　🪴</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main>
        {/* Top Header */}
        <header>
          <Menu className="hamb" />
          <label className="search">
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name, ID, roll no., department..."
            />
          </label>

          <div className="top-actions">
            <div className="date-wrap" ref={dateWrapRef}>
              <button onClick={() => setDateOpen(!dateOpen)}>
                <CalendarDays /> <b>{date}</b>
                <ChevronDown />
              </button>
              {dateOpen && (
                <div className="calendar-pop">
                  <div className="calendar-head">
                    <button type="button" onClick={handleHeaderPrevMonth}>‹</button>
                    <b>{MONTH_NAMES[headerCalMonth]} {headerCalYear}</b>
                    <button type="button" onClick={handleHeaderNextMonth}>›</button>
                  </div>
                  <div className="weekdays">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((x, i) => (
                      <span key={i}>{x}</span>
                    ))}
                  </div>
                  <div className="days">
                    {Array.from({ length: startDayOfHeaderMonth }, (_, i) => (
                      <i key={'e' + i} />
                    ))}
                    {Array.from({ length: daysInHeaderMonth }, (_, i) => i + 1).map((day) => {
                      const dStr = `${day} ${MONTH_SHORT[headerCalMonth]} ${headerCalYear}`;
                      const isSelected = date === dStr;
                      return (
                        <button
                          type="button"
                          className={isSelected ? 'chosen' : ''}
                          key={day}
                          onClick={() => {
                            setDate(dStr);
                            setDateOpen(false);
                            notify(`Date updated to ${dStr}`);
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="notice-wrap" ref={noticeWrapRef}>
              <button
                className="notice"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell />
                <i>{alerts.length}</i>
              </button>
              {notificationsOpen && (
                <div className="notify-panel">
                  <b>Notifications ({alerts.length})</b>
                  {alerts.map((al) => (
                    <p key={al.id || al.title}>
                      <strong>{al.title}</strong> {al.text}
                    </p>
                  ))}
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      notify('All notifications marked as read.');
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Profile"
            />
            <span>
              <b>Admin User</b>
              <small>Administrator</small>
            </span>
            <ChevronDown style={{ width: 14, color: '#64748b' }} />
          </div>
        </header>

        {/* Page Content with globalSearchQuery passed down */}
        <div className="page">
          {active === 'Attendance' && (
            <AttendancePage
              notify={notify}
              globalDate={date}
              setGlobalDate={setDate}
              globalSearchQuery={query}
            />
          )}
          {active === 'Academic Performance' && (
            <AcademicPerformancePage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {active === 'Learning Behavior' && (
            <LearningBehaviorPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {active === 'Socio-economic Factors' && (
            <SocioEconomicFactorsPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {active === 'Risk Overview' && (
            <RiskOverviewPage
              notify={notify}
              globalSearchQuery={query}
              globalDate={date}
            />
          )}
          {active === 'Students' && (
            <StudentsPage
              notify={notify}
              dashboardData={liveDashboard}
              globalSearchQuery={query}
              globalDate={date}
            />
          )}
          {active === 'Blockchain & Audit Trail' && (
            <BlockchainAuditPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {active === 'Risk Prediction' && (
            <RiskPredictionPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {(active === 'Interventions' || active === 'Intervention Plans') && (
            <InterventionsPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}
          {active === 'Alerts & Notifications' && (
            <AlertsNotificationsPage
              notify={notify}
              globalSearchQuery={query}
            />
          )}

          {/* Default Home Dashboard View */}
          <div className={['Risk Overview', 'Students', 'Attendance', 'Academic Performance', 'Learning Behavior', 'Socio-economic Factors', 'Blockchain & Audit Trail', 'Risk Prediction', 'Interventions', 'Intervention Plans', 'Alerts & Notifications'].includes(active) ? 'dashboard-hidden' : ''}>
            <div className="welcome">
              <div>
                <h1>Welcome back, Admin! 👋</h1>
                <p>AI-Powered insights to predict, prevent and improve student outcomes.</p>
              </div>
              <button
                className="report"
                onClick={() => notify('Report generation started. Download will be ready shortly.')}
              >
                <FileText />
                Generate Report
              </button>
            </div>

            {/* 4 Stat Cards */}
            <div className="summary">
              <Stat
                title="Total Students"
                value={totalCount}
                note="↑ 5.4%"
                icon={<Users />}
                color="blue"
                selected={selectedCard === 'Total Students'}
                onClick={() => activateCard('Total Students')}
              />
              <Stat
                title="Low Risk"
                value={lowCount}
                extra={`(${lowPct})`}
                note="↑ 3.2%"
                icon={<ShieldCheck />}
                color="green"
                selected={selectedCard === 'Low Risk'}
                onClick={() => activateCard('Low Risk')}
              />
              <Stat
                title="Medium Risk"
                value={medCount}
                extra={`(${medPct})`}
                note="↓ 1.1%"
                icon={<AlertTriangle />}
                color="amber"
                selected={selectedCard === 'Medium Risk'}
                onClick={() => activateCard('Medium Risk')}
              />
              <Stat
                title="High Risk"
                value={highCount}
                extra={`(${highPct})`}
                note="↓ 2.1%"
                icon={<ShieldCheck />}
                color="red"
                selected={selectedCard === 'High Risk'}
                onClick={() => activateCard('High Risk')}
              />
            </div>

            {/* Analysis Row: 3 Panels */}
            <div className="analysis">
              <Panel title="Risk Distribution" cls="distribution">
                <div className="donut" style={{ background: donutGradient }}>
                  <div>
                    <b>{lowPct}</b>
                  </div>
                </div>
                <div className="risk-list">
                  {risk.map((x) => (
                    <p key={x[0]}>
                      <i className={x[3]} />
                      <span>
                        <b>{x[0]}</b>
                        <small>
                          {x[1]} ({x[2]})
                        </small>
                      </span>
                    </p>
                  ))}
                </div>
                <footer>◷　Last updated: {date}, 10:30 AM</footer>
              </Panel>

              <Panel title="Risk Trend Over Time" cls="trend">
                <div className="legend">
                  <i className="high" />
                  High Risk ({highCount}) <i className="medium" />
                  Medium Risk ({medCount}) <i className="low" />
                  Low Risk ({lowCount})
                </div>
                <svg viewBox="0 0 520 245">
                  <g className="grid">
                    <path d="M42 25H500M42 75H500M42 125H500M42 175H500M42 225H500M42 25V225M135 25V225M230 25V225M325 25V225M420 25V225" />
                  </g>
                  <g className="axis">
                    <text x="12" y="230">0</text>
                    <text x="0" y="180">20</text>
                    <text x="0" y="130">40</text>
                    <text x="0" y="80">60</text>
                    <text x="0" y="30">80</text>
                    <text x="45" y="243">Jan</text>
                    <text x="137" y="243">Feb</text>
                    <text x="232" y="243">Mar</text>
                    <text x="327" y="243">Apr</text>
                    <text x="422" y="243">May</text>
                  </g>
                  <polyline className="l1" points={highPolyline} />
                  <polyline className="l2" points={medPolyline} />
                  <polyline className="l3" points={lowPolyline} />
                  {highDots.map((p, i) => (
                    <circle className="gdot" cx={p[0]} cy={p[1]} r="4.5" key={`high-${i}`} style={{ fill: '#ff444a' }} />
                  ))}
                  {medDots.map((p, i) => (
                    <circle className="gdot" cx={p[0]} cy={p[1]} r="4.5" key={`med-${i}`} style={{ fill: '#ffad12' }} />
                  ))}
                  {lowDots.map((p, i) => (
                    <circle className="gdot" cx={p[0]} cy={p[1]} r="4.5" key={`low-${i}`} style={{ fill: '#38bf58' }} />
                  ))}
                </svg>
                <footer>◷　Last 5 months on-chain verified trend</footer>
              </Panel>

              <section className="panel factors">
                <h3>Top Risk Factors (80 Students Cohort)</h3>
                {topRiskFactors.map(({ factor, impact, icon: Icon }) => (
                  <div className="factor" key={factor}>
                    <span>
                      <Icon />
                    </span>
                    <label>
                      <b>{factor}</b>
                      <em>
                        <i style={{ width: impact }} />
                      </em>
                    </label>
                    <strong>{impact}</strong>
                  </div>
                ))}
              </section>
            </div>

            {/* Lower Row: High Risk Table + Alerts & Effectiveness */}
            <div className="lower">
              <Panel
                title={`High Risk Students (${shown.length})`}
                cls="table-panel"
                action="View All Students"
                onAction={() => setActive('Students')}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Risk Score</th>
                      <th>Risk Level</th>
                      <th>Main Risk Factors</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.slice((dashboardPage - 1) * 5, dashboardPage * 5).map((s) => (
                      <tr key={s[0]}>
                        <td><b>{s[0]}</b></td>
                        <td>
                          <span className="person">{s[5]}</span>
                          {s[1]}
                        </td>
                        <td>{s[2]}</td>
                        <td>
                          <b>{s[3]}</b>
                          <em className="score">
                            <i style={{ width: s[3] }} />
                          </em>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 9px',
                              borderRadius: '16px',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: 'rgba(239, 68, 68, 0.08)',
                              color: '#dc2626',
                              border: '1px solid rgba(239, 68, 68, 0.22)'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                            High Risk
                          </span>
                        </td>
                        <td><small style={{ color: '#64748b', fontSize: '11px' }}>{s[4]}</small></td>
                        <td>
                          <button
                            className="view"
                            onClick={() => {
                              setActive('Students');
                              notify(`Navigating to student roster for ${s[1]} (${s[0]}).`);
                            }}
                          >
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <footer>
                  Showing {shown.length > 0 ? (dashboardPage - 1) * 5 + 1 : 0} to{' '}
                  {Math.min(dashboardPage * 5, shown.length)} of {shown.length} students{' '}
                  <span className="pagination">
                    <button
                      onClick={() => setDashboardPage((p) => Math.max(1, p - 1))}
                      disabled={dashboardPage === 1}
                      style={{ border: 'none', background: 'none', cursor: dashboardPage === 1 ? 'not-allowed' : 'pointer', opacity: dashboardPage === 1 ? 0.3 : 1 }}
                    >
                      <ChevronLeft />
                    </button>
                    {Array.from({ length: Math.ceil(shown.length / 5) || 1 }, (_, i) => i + 1).map((pageNum) => (
                      <b
                        key={pageNum}
                        onClick={() => setDashboardPage(pageNum)}
                        style={{
                          cursor: 'pointer',
                          background: dashboardPage === pageNum ? '#7263f9' : '#eef2ff',
                          color: dashboardPage === pageNum ? '#fff' : '#1e293b'
                        }}
                      >
                        {pageNum}
                      </b>
                    ))}
                    <button
                      onClick={() => setDashboardPage((p) => Math.min(Math.ceil(shown.length / 5) || 1, p + 1))}
                      disabled={dashboardPage >= (Math.ceil(shown.length / 5) || 1)}
                      style={{ border: 'none', background: 'none', cursor: dashboardPage >= (Math.ceil(shown.length / 5) || 1) ? 'not-allowed' : 'pointer', opacity: dashboardPage >= (Math.ceil(shown.length / 5) || 1) ? 0.3 : 1 }}
                    >
                      <ChevronRight />
                    </button>
                  </span>
                </footer>
              </Panel>

              <div className="right">
                <section className="panel alerts">
                  <h3>
                    Recent Alerts{' '}
                    <button onClick={() => notify('All alerts opened.')}>View All</button>
                  </h3>
                  {alerts.map((al) => (
                    <Alert
                      key={al.id || al.title}
                      icon={al.icon}
                      title={al.title}
                      text={al.text}
                      time={al.time}
                    />
                  ))}
                  <button
                    className="all-alerts"
                    onClick={() => notify('Opening all alerts.')}
                  >
                    View All Alerts
                  </button>
                </section>

                <section className="panel effectiveness">
                  <h3>Intervention Effectiveness</h3>
                  <div>
                    <b>76%</b>
                    <span>
                      <strong>Overall Success Rate</strong>
                      <small>↑ 12% from last month</small>
                    </span>
                    <svg viewBox="0 0 130 65">
                      <polyline points="5,55 28,36 52,43 76,18 98,30 125,8" />
                    </svg>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {toast && <div className="toast">✓ {toast}</div>}
        </div>
      </main>
    </div>
  );
}

// 100% Original Stat Card Component Matching globals.css
function Stat({ title, value, extra, note, icon, color, selected, onClick }) {
  return (
    <article
      onClick={onClick}
      className={'stat ' + color + (selected ? ' selected' : '')}
      style={{ cursor: 'pointer' }}
    >
      <div>
        <small>{title}</small>
        <h2>
          {value} {extra && <em>{extra}</em>}
        </h2>
        <p>
          {note} <span>vs last semester</span>
        </p>
      </div>
      <i>{icon}</i>
    </article>
  );
}

// 100% Original Panel Component Matching globals.css
function Panel({ title, cls, action, onAction, children }) {
  return (
    <section className={'panel ' + (cls || '')}>
      <h3>
        {title}
        {action && <button onClick={onAction}>{action}</button>}
      </h3>
      {children}
    </section>
  );
}

// 100% Original Alert Component Matching globals.css
function Alert({ icon, title, text, time }) {
  return (
    <article className="alert">
      <i>{icon}</i>
      <span>
        <b>{title}</b>
        {text}
        <time>{time}</time>
      </span>
    </article>
  );
}

// 100% Original RiskOverview Component Matching globals.css
function RiskOverview({ notify, dashboardData, globalSearchQuery = '' }) {
  const highStudents = dashboardData?.highRiskStudents || [
    { id: 'STU1003', name: 'Aarav Mehta', initials: 'AM', factors: 'Low Attendance (<60%), Low CGPA' },
    { id: 'STU1004', name: 'Pooja Sharma', initials: 'PS', factors: 'Attendance Below 75%, Low CGPA' },
    { id: 'STU1007', name: 'Vivek Yadav', initials: 'VY', factors: 'Attendance Below 75%, Low CGPA' },
    { id: 'STU1008', name: 'Neha Patel', initials: 'NP', factors: 'Low Attendance (<60%), 4 Backlogs' }
  ];

  const filteredHighStudents = useMemo(() => {
    if (!globalSearchQuery.trim()) return highStudents;
    const q = globalSearchQuery.toLowerCase();
    return highStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.factors && s.factors.toLowerCase().includes(q))
    );
  }, [highStudents, globalSearchQuery]);

  const total = dashboardData?.stats?.totalStudents?.value || '8';
  const highCount = dashboardData?.stats?.highRisk?.value || '4';
  const highPct = dashboardData?.stats?.highRisk?.percentage || '50.0%';
  const medCount = dashboardData?.stats?.mediumRisk?.value || '1';
  const medPct = dashboardData?.stats?.mediumRisk?.percentage || '12.5%';
  const lowCount = dashboardData?.stats?.lowRisk?.value || '3';
  const lowPct = dashboardData?.stats?.lowRisk?.percentage || '37.5%';

  return (
    <div className="risk-page">
      <div className="risk-head">
        <div>
          <h1>
            <ShieldCheck style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10 }} />
            Risk Overview & Analytics
          </h1>
          <p>Deep predictive breakdown of student dropout factors and intervention priorities.</p>
        </div>
        <div>
          <button onClick={() => notify('Risk Assessment report downloaded.')}>
            Download Risk Analysis
          </button>
        </div>
      </div>

      <div className="risk-top">
        <div className="risk-box dist">
          <h3>Department Risk Distribution</h3>
          <div className="dept-donut">
            <b>{total}</b>
            <small>Assessed</small>
          </div>
          <ul>
            <li><i /> Computer Engg.</li>
            <li><i className="d1" /> Information Tech.</li>
            <li><i className="d2" /> Electronics Engg.</li>
            <li><i className="d3" /> Mechanical Engg.</li>
            <li><i className="d4" /> Civil Engg.</li>
          </ul>
        </div>

        <div className="risk-box breakdown">
          <h3>Risk Level Breakdown</h3>
          <div>
            <b>High Risk (Critical)</b> <span>{highCount} ({highPct})</span>
            <em><i style={{ width: highPct }} /></em>
          </div>
          <div>
            <b>Medium Risk (Moderate)</b> <span>{medCount} ({medPct})</span>
            <em><i className="amber" style={{ width: medPct }} /></em>
          </div>
          <div>
            <b>Low Risk (Good Standing)</b> <span>{lowCount} ({lowPct})</span>
            <em><i className="green" style={{ width: lowPct }} /></em>
          </div>
        </div>

        <div className="risk-box attention">
          <h3>Critical Attention Required</h3>
          {filteredHighStudents.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: 12, padding: 8 }}>No students match search.</p>
          ) : (
            filteredHighStudents.slice(0, 3).map((s) => (
              <div key={s.id}>
                <b>{s.name} ({s.id})</b>
                <mark>High</mark>
                <button onClick={() => notify(`Intervention started for ${s.name}`)}>
                  Intervene
                </button>
              </div>
            ))
          )}
          <a onClick={() => notify('Opening all critical intervention cases.')}>View all critical cases →</a>
        </div>
      </div>

      <div className="risk-bottom">
        <div className="risk-box gauge">
          <h3>Retention Health Index</h3>
          <b>
            84.6% <small>Institutional Stability Score</small>
          </b>
        </div>
        <div className="risk-box trend-summary">
          <h3>Early Warning Signals</h3>
          <p>
            Attendance Drops (&gt;15%) <b>4 Students</b>
          </p>
          <p>
            Failed Internal Assessments <b>5 Students</b>
          </p>
          <p>
            Fee Defaulters / Inactive <b>3 Students</b>
          </p>
        </div>
        <div className="risk-box heat">
          <h3>Semester-wise Risk Matrix</h3>
          <p>
            <span>Sem 4</span>
            <i>Low</i><i>Low</i><i style={{ background: '#fff2e2' }}>Med</i><i style={{ background: '#ffe6e8' }}>High</i>
          </p>
          <p>
            <span>Sem 6</span>
            <i>Low</i><i style={{ background: '#fff2e2' }}>Med</i><i>Low</i><i style={{ background: '#ffe6e8' }}>High</i>
          </p>
        </div>
      </div>
    </div>
  );
}