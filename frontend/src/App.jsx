import { useMemo, useState } from "react";
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
  ChevronRight
} from "lucide-react";
import AttendancePage from "./pages/Attendance.jsx";
import AcademicPerformancePage from "./pages/AcademicPerformance.jsx";
import LearningBehaviorPage from "./pages/LearningBehavior.jsx";
import SocioEconomicFactorsPage from "./pages/SocioEconomicFactors.jsx";

const students = [
  ['1042', 'Rahul Patel', 'Computer Engineering', '87%', 'Attendance, Backlogs, Performance', 'RP'],
  ['1078', 'Sneha Singh', 'Information Technology', '82%', 'Performance, Engagement, Backlogs', 'SS'],
  ['1123', 'Aarav Mehta', 'Electronics Engineering', '79%', 'Attendance, Engagement', 'AM'],
  ['1201', 'Pooja Sharma', 'Mechanical Engineering', '76%', 'Performance, Attendance', 'PS'],
  ['1250', 'Karan Verma', 'Civil Engineering', '74%', 'Backlogs, Attendance', 'KV']
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
      [Download, 'Export Data']
    ]
  ]
];

const risk = [
  ['Low Risk', '3,780', '69.8%', 'low'],
  ['Medium Risk', '1,120', '20.7%', 'medium'],
  ['High Risk', '520', '9.6%', 'high']
];

function App() {
  const [active, setActive] = useState('Attendance');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [date, setDate] = useState('13 May 2025');
  const [selectedCard, setSelectedCard] = useState('');

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const activateCard = (name) => {
    setSelectedCard(name);
    notify(name + ' insights selected.');
    window.setTimeout(() => setSelectedCard(''), 600);
  };

  const shown = useMemo(
    () => students.filter((s) => s.join(' ').toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="side">
        <div className="logo" onClick={() => setActive('Attendance')} style={{ cursor: 'pointer' }}>
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
            <div className="date-wrap">
              <button onClick={() => setDateOpen(!dateOpen)}>
                <CalendarDays /> <b>{date}</b>
                <ChevronDown />
              </button>
              {dateOpen && (
                <div className="calendar-pop">
                  <div className="calendar-head">
                    <button>‹</button>
                    <b>May 2025</b>
                    <button>›</button>
                  </div>
                  <div className="weekdays">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => (
                      <span key={i}>{x}</span>
                    ))}
                  </div>
                  <div className="days">
                    {Array.from({ length: 4 }, (_, i) => (
                      <i key={'e' + i} />
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        className={date === `${day} May 2025` ? 'chosen' : ''}
                        key={day}
                        onClick={() => {
                          setDate(`${day} May 2025`);
                          setDateOpen(false);
                          notify(`Dashboard updated for ${day} May 2025`);
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="notice-wrap">
              <button
                className="notice"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell />
                <i>8</i>
              </button>
              {notificationsOpen && (
                <div className="notify-panel">
                  <b>Notifications</b>
                  <p>
                    <strong>High risk alert</strong> 3 students need attention.
                  </p>
                  <p>
                    <strong>Attendance update</strong> Attendance data for 13 May 2025 synced.
                  </p>
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

        {/* Page Content */}
        <div className="page">
          {active === 'Attendance' && <AttendancePage notify={notify} />}
          {active === 'Academic Performance' && <AcademicPerformancePage notify={notify} />}
          {active === 'Learning Behavior' && <LearningBehaviorPage notify={notify} />}
          {active === 'Socio-economic Factors' && <SocioEconomicFactorsPage notify={notify} />}
          {active === 'Risk Overview' && <RiskOverview notify={notify} />}
          {active === 'Students' && <StudentsPage notify={notify} />}

          {/* Default Dashboard */}
          <div className={['Risk Overview', 'Students', 'Attendance', 'Academic Performance', 'Learning Behavior', 'Socio-economic Factors'].includes(active) ? 'dashboard-hidden' : ''}>
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

            <div className="summary">
              <Stat
                title="Total Students"
                value="5,420"
                note="↑ 5.4%"
                icon={<Users />}
                color="blue"
                selected={selectedCard === 'Total Students'}
                onClick={() => activateCard('Total Students')}
              />
              <Stat
                title="Low Risk"
                value="3,780"
                extra="(69.8%)"
                note="↑ 3.2%"
                icon={<ShieldCheck />}
                color="green"
                selected={selectedCard === 'Low Risk'}
                onClick={() => activateCard('Low Risk')}
              />
              <Stat
                title="Medium Risk"
                value="1,120"
                extra="(20.7%)"
                note="↓ 1.1%"
                icon={<AlertTriangle />}
                color="amber"
                selected={selectedCard === 'Medium Risk'}
                onClick={() => activateCard('Medium Risk')}
              />
              <Stat
                title="High Risk"
                value="520"
                extra="(9.6%)"
                note="↓ 2.1%"
                icon={<ShieldCheck />}
                color="red"
                selected={selectedCard === 'High Risk'}
                onClick={() => activateCard('High Risk')}
              />
            </div>

            <div className="analysis">
              <Panel title="Risk Distribution" cls="distribution">
                <div className="donut">
                  <div>
                    <b>69.8%</b>
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
                <footer>◷　Last updated: 13 May 2025, 10:30 AM</footer>
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
                    <text x="0" y="180">1000</text>
                    <text x="0" y="130">2000</text>
                    <text x="0" y="80">3000</text>
                    <text x="0" y="80">4000</text>
                    <text x="45" y="243">Jan</text>
                    <text x="137" y="243">Feb</text>
                    <text x="232" y="243">Mar</text>
                    <text x="327" y="243">Apr</text>
                    <text x="422" y="243">May</text>
                  </g>
                  <polyline className="l1" points="48,72 135,62 230,52 325,40 420,27" />
                  <polyline className="l2" points="48,155 135,160 230,164 325,169 420,174" />
                  <polyline className="l3" points="48,195 135,198 230,201 325,204 420,207" />
                  {[[48, 72], [135, 62], [230, 52], [325, 40], [420, 27]].map((p, i) => (
                    <circle className="gdot" cx={p[0]} cy={p[1]} r="4" key={i} />
                  ))}
                </svg>
                <footer>◷　Last 5 months trend</footer>
              </Panel>

              <section className="panel factors">
                <h3>Top Risk Factors</h3>
                {[
                  ['Low Attendance', '72%', Users],
                  ['Academic Performance', '65%', BookOpen],
                  ['Backlogs', '48%', BriefcaseBusiness],
                  ['Low Learning Engagement', '41%', BrainCircuit],
                  ['Financial Difficulty', '28%', IndianRupee]
                ].map(([n, v, Icon]) => (
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

            <div className="lower">
              <Panel
                title="High Risk Students"
                cls="table-panel"
                action="View All Students"
                onAction={() => notify('Showing all high-risk students.')}
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
                    {shown.map((s) => (
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
                            onClick={() => notify('Opening student risk profile.')}
                          >
                            <Eye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <footer>
                  Showing 1 to {shown.length} of 520 students{' '}
                  <span className="pagination">
                    <ChevronLeft />
                    <b>1</b>2　3　…　104
                    <ChevronRight />
                  </span>
                </footer>
              </Panel>

              <div className="right">
                <section className="panel alerts">
                  <h3>
                    Recent Alerts{' '}
                    <button onClick={() => notify('All alerts opened.')}>View All</button>
                  </h3>
                  <Alert
                    icon="⚠"
                    title="High Risk Alert"
                    text="Student ID 1042 has a high dropout risk (87%)."
                    time="2 min ago"
                  />
                  <Alert
                    icon="⚠"
                    title="Attendance Alert"
                    text="15 students have attendance below 60%."
                    time="25 min ago"
                  />
                  <Alert
                    icon="♧"
                    title="Intervention Due"
                    text="8 interventions are pending follow-up."
                    time="1 hour ago"
                  />
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

function StudentsPage({ notify }) {
  const all = [
    ...students,
    ['1306', 'Anjali Desai', 'Information Tech.', '33%', 'Performance', 'AD'],
    ['1310', 'Vivek Yadav', 'Electronics Engg.', '68%', 'Attendance', 'VY'],
    ['1318', 'Neha Patel', 'Mechanical Engg.', '28%', 'Backlogs', 'NP']
  ];

  return (
    <div className="students-page">
      <div className="student-head">
        <div>
          <h1>
            <Users /> Students
          </h1>
          <p>Dashboard　›　Students</p>
          <small>Manage and view all student records in one place. Add new students or import in bulk using Excel.</small>
        </div>
        <span>
          <button onClick={() => notify('Add student form opened.')}>＋ Add Student</button>
          <button onClick={() => notify('Excel import opened.')}>▣ Import from Excel</button>
          <button onClick={() => notify('Student records exported.')}>⇩ Export</button>
        </span>
      </div>

      <section className="student-box">
        <div className="student-filters">
          <label>
            <Search />
            <input placeholder="Search by name, roll no., or student ID..." />
          </label>
          {['All Departments', 'All Semesters', 'All Risk Levels', 'All Status'].map((x) => (
            <button key={x}>{x}　⌄</button>
          ))}
          <button onClick={() => notify('Filters applied.')}>⚱ Filters</button>
          <a onClick={() => notify('Filters cleared.')}>Clear All</a>
        </div>

        <table>
          <thead>
            <tr>
              {[
                '□',
                'Student ID',
                'Student Name',
                'Roll No.',
                'Department',
                'Semester',
                'Risk Score',
                'Risk Level',
                'Attendance',
                'CGPA',
                'Backlogs',
                'Status',
                'Action'
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map((s, i) => {
              let risk =
                +s[3].slice(0, -1) > 70
                  ? 'High'
                  : +s[3].slice(0, -1) > 55
                  ? 'Medium'
                  : 'Low';
              return (
                <tr key={s[0]}>
                  <td>□</td>
                  <td>STU{1001 + i}</td>
                  <td>
                    <span className="person">{s[5]}</span>
                    {s[1]}
                  </td>
                  <td>CE20210{i + 1}</td>
                  <td>{s[2]}</td>
                  <td>{i < 5 ? 4 : 6}</td>
                  <td>
                    {s[3]}{' '}
                    <em className="score">
                      <i style={{ width: s[3] }} />
                    </em>
                  </td>
                  <td>
                    <mark className={risk.toLowerCase()}>{risk}</mark>
                  </td>
                  <td>
                    {56 + i * 5}%{' '}
                    <em className="score">
                      <i style={{ width: 56 + i * 5 + '%' }} />
                    </em>
                  </td>
                  <td>{(5.4 + i * 0.4).toFixed(1)}</td>
                  <td>{i % 4}</td>
                  <td>
                    <mark className="low">Active</mark>
                  </td>
                  <td>
                    <button className="view" onClick={() => notify('Opening ' + s[1])}>
                      <Eye />
                    </button>
                    　⋮
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <footer>
          Showing 1 to 8 of 5,420 results{' '}
          <span>
            Rows per page:　 10　⌄　　‹　 <b>1</b>　2　3　…　542　›
          </span>
        </footer>
      </section>

      <div className="student-stats">
        {[
          ['Total Students', '5,420', '100% of total enrollment', 'purple'],
          ['Active Students', '4,890', '90.2% of total students', 'green'],
          ['Inactive Students', '320', '5.9% of total students', 'amber'],
          ['At Risk Students', '1,640', '30.2% of total students', 'red'],
          ['Avg. CGPA', '6.32', 'Across all students', 'blue']
        ].map((x) => (
          <section className={x[3]} key={x[0]}>
            <b>{x[0]}</b>
            <h2>{x[1]}</h2>
            <small>{x[2]}</small>
          </section>
        ))}
      </div>
    </div>
  );
}

function RiskOverview({ notify }) {
  const rows = [
    ['Low Attendance', '2,674 (49.3%)', '8.7 / 10', 'High'],
    ['Academic Performance', '2,132 (39.3%)', '7.6 / 10', 'High'],
    ['Backlogs', '1,856 (34.2%)', '6.9 / 10', 'Medium'],
    ['Low Learning Engagement', '1,432 (26.4%)', '6.1 / 10', 'Medium'],
    ['Financial Difficulty', '1,025 (18.9%)', '5.3 / 10', 'Low']
  ];

  return (
    <div className="risk-page">
      <div className="risk-head">
        <div>
          <h1>
            <ShieldCheck />
            Risk Overview
          </h1>
          <p>Gain a comprehensive view of student risks across departments, factors and severity levels.</p>
        </div>
        <span>
          <button onClick={() => notify('Risk overview exported.')}>
            <Download /> Export Overview
          </button>
          <button onClick={() => notify('Filters opened.')}>
            <Target /> Filters
          </button>
        </span>
      </div>

      <div className="risk-top">
        <section className="risk-box dist">
          <h3>Risk Distribution by Department</h3>
          <div className="dept-donut">
            <b>
              5,420<small>Total</small>
            </b>
          </div>
          <ul>
            {[
              'Computer Engineering　1,538',
              'Information Technology　1,338',
              'Electronics Engineering　1,025',
              'Mechanical Engineering　895',
              'Civil Engineering　624'
            ].map((x, i) => (
              <li key={x}>
                <i className={'d' + i} />
                {x}
              </li>
            ))}
          </ul>
          <small>▣　Based on active students</small>
        </section>

        <section className="risk-box breakdown">
          <h3>Risk Level Breakdown</h3>
          {[
            ['High Risk', '520 (9.6%)', 'red'],
            ['Medium Risk', '1,120 (20.7%)', 'amber'],
            ['Low Risk', '3,780 (69.8%)', 'green'],
            ['Not Assessed', '0 (0.0%)', 'grey']
          ].map((x) => (
            <div key={x[0]}>
              <b>{x[0]}</b>
              <span>{x[1]}</span>
              <em>
                <i className={x[2]} />
              </em>
            </div>
          ))}
          <small>Percentage of total students</small>
        </section>

        <section className="risk-box attention">
          <h3>
            Students Needing Attention{' '}
            <button onClick={() => notify('All attention students opened.')}>View All</button>
          </h3>
          {students.map((s, i) => (
            <div key={s[0]}>
              <span className="person">{s[5]}</span>
              <b>
                {s[1]}
                <small>STU{i + 1001}</small>
              </b>
              <mark>{i % 2 ? 'Medium' : 'High'}</mark>
              <label>
                {i % 2 ? 'Academic Performance' : 'Low Attendance'}
                <small>Risk Reason</small>
              </label>
            </div>
          ))}
          <a onClick={() => notify('All students opened.')}>View All Students　→</a>
        </section>
      </div>

      <section className="risk-box factor-table">
        <h3>Risk by Main Factors</h3>
        <table>
          <thead>
            <tr>
              <th>Risk Factor</th>
              <th>Affected Students</th>
              <th>Avg Impact Score</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]}>
                <td>●　{r[0]}</td>
                <td>{r[1]}</td>
                <td>
                  {r[2]}　
                  <em>
                    <i style={{ width: 88 - i * 13 + '%' }} />
                  </em>
                </td>
                <td>
                  <mark className={r[3].toLowerCase()}>{r[3]}</mark>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <a onClick={() => notify('All risk factors opened.')}>View All Risk Factors　→</a>
      </section>

      <div className="risk-bottom">
        <section className="risk-box gauge">
          <h3>Risk Score Range</h3>
          <b>
            6.8
            <small>
              Average Risk Score
              <br />
              out of 10
            </small>
          </b>
        </section>
        <section className="risk-box trend-summary">
          <h3>Trend Summary</h3>
          <p>
            ↗　Students moving to lower risk　 <b>↑ 12.4%</b>
          </p>
          <p>
            ↓　Students moving to higher risk　 <b>↓ 6.8%</b>
          </p>
          <p>
            ⌁　Overall risk score change　 <b>↓ 2.1%</b>
          </p>
        </section>
        <section className="risk-box heat">
          <h3>
            Department Risk Heatmap{' '}
            <button onClick={() => notify('Full heatmap opened.')}>View Full Heatmap</button>
          </h3>
          {[
            'Computer Engineering',
            'Information Technology',
            'Electronics',
            'Mechanical',
            'Civil Engineering'
          ].map((x, i) => (
            <p key={x}>
              {x}
              <i>{726 - i * 80}</i>
              <i>{512 - i * 50}</i>
              <i>{210 - i * 30}</i>
              <i>{90 - i * 12}</i>
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}

function Stat(p) {
  return (
    <section className={'stat ' + p.color}>
      <div>
        <small>{p.title}</small>
        <h2>
          {p.value} <em>{p.extra}</em>
        </h2>
        <p>
          {p.note} <span>from last month</span>
        </p>
      </div>
      <i>{p.icon}</i>
    </section>
  );
}

function Panel({ title, children, cls = '', action, onAction }) {
  return (
    <section className={'panel ' + cls}>
      <h3>
        {title}
        {action && <button onClick={onAction}>{action}</button>}
      </h3>
      {children}
    </section>
  );
}

function Alert({ icon, title, text, time }) {
  return (
    <div className="alert">
      <i>{icon}</i>
      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>
      <time>{time}</time>
    </div>
  );
}

export default App;