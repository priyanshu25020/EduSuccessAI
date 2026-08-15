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
import BlockchainAuditPage from "./pages/BlockchainAudit.jsx";
import RiskPredictionPage from "./pages/RiskPrediction.jsx";
import InterventionsPage from "./pages/Interventions.jsx";
import AlertsNotificationsPage from "./pages/AlertsNotifications.jsx";
import { dashboardService } from "./services/dashboardService";

// Fallback baseline students if backend is offline
const fallbackStudents = [
  ['STU1003', 'Aarav Mehta', 'Electronics Engg.', '93%', 'Low Attendance (<60%), Low CGPA (<4.0)', 'AM'],
  ['STU1004', 'Pooja Sharma', 'Mechanical Engg.', '63%', 'Attendance Below 75%, Low CGPA', 'PS'],
  ['STU1007', 'Vivek Yadav', 'Electronics Engg.', '71%', 'Attendance Below 75%, Low CGPA', 'VY'],
  ['STU1008', 'Neha Patel', 'Mechanical Engg.', '100%', 'Low Attendance (<60%), 4 Backlogs', 'NP']
];

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
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardPage, setDashboardPage] = useState(1);

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

  // Fetch real-time dashboard data from Backend
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const data = await dashboardService.getStats();
        if (isMounted && data) {
          setDashboardData(data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [active, date]);

  // Dynamic Values
  const totalCount = dashboardData?.stats?.totalStudents?.value || '8';
  const lowCount = dashboardData?.stats?.lowRisk?.value || '3';
  const lowPct = dashboardData?.stats?.lowRisk?.percentage || '37.5%';
  const medCount = dashboardData?.stats?.mediumRisk?.value || '1';
  const medPct = dashboardData?.stats?.mediumRisk?.percentage || '12.5%';
  const highCount = dashboardData?.stats?.highRisk?.value || '4';
  const highPct = dashboardData?.stats?.highRisk?.percentage || '50.0%';

  const risk = [
    ['Low Risk', lowCount, lowPct, 'low'],
    ['Medium Risk', medCount, medPct, 'medium'],
    ['High Risk', highCount, highPct, 'high']
  ];

  const donutGradient = dashboardData?.donutGradient
    ? `conic-gradient(#38bf58 0 ${dashboardData.donutGradient.lowPct}%, #ffad12 ${dashboardData.donutGradient.lowPct}% ${dashboardData.donutGradient.lowPct + dashboardData.donutGradient.mediumPct}%, #ff444a ${dashboardData.donutGradient.lowPct + dashboardData.donutGradient.mediumPct}% 100%)`
    : 'conic-gradient(#38bf58 0 37.5%, #ffad12 37.5% 50%, #ff444a 50% 100%)';

  const riskFactorsList = dashboardData?.topRiskFactors
    ? [
        [dashboardData.topRiskFactors[0]?.factor || 'Low Attendance (<75%)', dashboardData.topRiskFactors[0]?.impact || '50%', Users],
        [dashboardData.topRiskFactors[1]?.factor || 'Academic Performance (<5 CGPA)', dashboardData.topRiskFactors[1]?.impact || '63%', BookOpen],
        [dashboardData.topRiskFactors[2]?.factor || 'Active Backlogs', dashboardData.topRiskFactors[2]?.impact || '88%', BriefcaseBusiness],
        [dashboardData.topRiskFactors[3]?.factor || 'Low Learning Engagement', dashboardData.topRiskFactors[3]?.impact || '50%', BrainCircuit],
        [dashboardData.topRiskFactors[4]?.factor || 'Financial Difficulty', dashboardData.topRiskFactors[4]?.impact || '38%', IndianRupee]
      ]
    : [
        ['Low Attendance', '50%', Users],
        ['Academic Performance', '63%', BookOpen],
        ['Backlogs', '88%', BriefcaseBusiness],
        ['Low Learning Engagement', '50%', BrainCircuit],
        ['Financial Difficulty', '38%', IndianRupee]
      ];

  const studentRows = useMemo(() => {
    if (dashboardData?.highRiskStudents && dashboardData.highRiskStudents.length > 0) {
      return dashboardData.highRiskStudents.map((s) => [
        s.id,
        s.name,
        s.dept,
        s.riskScore,
        s.factors,
        s.initials || s.name.slice(0, 2).toUpperCase()
      ]);
    }
    return fallbackStudents;
  }, [dashboardData]);

  const shown = useMemo(
    () => studentRows.filter((s) => s.join(' ').toLowerCase().includes(query.toLowerCase())),
    [studentRows, query]
  );

  const alerts = dashboardData?.alerts || [
    {
      id: 'ALT-1',
      icon: '⚠',
      title: 'High Risk Alert',
      text: '4 students (Aarav Mehta, Pooja Sharma...) have high dropout risk.',
      time: 'Just now'
    },
    {
      id: 'ALT-2',
      icon: '⚠',
      title: 'Attendance Alert',
      text: '4 students have attendance below 75%.',
      time: '10 min ago'
    },
    {
      id: 'ALT-3',
      icon: '♧',
      title: 'Intervention Due',
      text: '5 personalized interventions recommended.',
      time: '1 hour ago'
    }
  ];

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
            <RiskOverview
              notify={notify}
              dashboardData={dashboardData}
              globalSearchQuery={query}
            />
          )}
          {active === 'Students' && (
            <StudentsPage
              notify={notify}
              dashboardData={dashboardData}
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

          {/* Default Dashboard */}
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
                  High Risk <i className="medium" />
                  Medium Risk <i className="low" />
                  Low Risk
                </div>
                <svg viewBox="0 0 520 245">
                  <g className="grid">
                    <path d="M42 25H500M42 75H500M42 125H500M42 175H500M42 225H500M42 25V225M135 25V225M230 25V225M325 25V225M420 25V225" />
                  </g>
                  <g className="axis">
                    <text x="12" y="230">0</text>
                    <text x="0" y="180">2</text>
                    <text x="0" y="130">4</text>
                    <text x="0" y="80">6</text>
                    <text x="0" y="30">8</text>
                    <text x="45" y="243">Jan</text>
                    <text x="137" y="243">Feb</text>
                    <text x="232" y="243">Mar</text>
                    <text x="327" y="243">Apr</text>
                    <text x="422" y="243">May</text>
                  </g>
                  <polyline className="l1" points="48,150 135,130 230,110 325,90 420,70" />
                  <polyline className="l2" points="48,165 135,170 230,175 325,180 420,185" />
                  <polyline className="l3" points="48,195 135,198 230,201 325,204 420,207" />
                  {[[48, 150], [135, 130], [230, 110], [325, 90], [420, 70]].map((p, i) => (
                    <circle className="gdot" cx={p[0]} cy={p[1]} r="4" key={i} />
                  ))}
                </svg>
                <footer>◷　Last 5 months trend</footer>
              </Panel>

              <section className="panel factors">
                <h3>Top Risk Factors</h3>
                {riskFactorsList.map(([n, v, Icon]) => (
                  <div className="factor" key={n}>
                    <span>
                      <Icon />
                    </span>
                    <label>
                      <b>{n}</b>
                      <em>
                        <i style={{ width: v }} />
                      </em>
                    </label>
                    <strong>{v}</strong>
                  </div>
                ))}
              </section>
            </div>

            {/* Lower Row: High Risk Table + Alerts & Effectiveness */}
            <div className="lower">
              <Panel
                title="High Risk Students"
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
                        <td>{s[0]}</td>
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
                          <mark>High</mark>
                        </td>
                        <td>{s[4]}</td>
                        <td>
                          <button
                            className="view"
                            onClick={() => notify(`Opening risk profile for ${s[1]} (${s[0]}).`)}
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