// backend/src/controllers/dashboardController.js
const { students, alerts } = require('../data/db');
const { evaluateStudentRisk } = require('../utils/riskEngine');

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

const calculateStudentMonthlyAttendance = (student, targetDateStr = '15 Aug 2026') => {
  const { monthKey, daysInMonth } = parseDateParams(targetDateStr);
  const historyEntries = Object.entries(student.attendanceHistory || {}).filter(
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

exports.getDashboardStats = (req, res) => {
  const total = students.length;
  const targetDate = req?.query?.date || '15 Aug 2026';

  if (total === 0) {
    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents: { value: '0', change: '0%' },
          lowRisk: { value: '0', percentage: '0%', change: '0%' },
          mediumRisk: { value: '0', percentage: '0%', change: '0%' },
          highRisk: { value: '0', percentage: '0%', change: '0%' }
        },
        riskDistribution: [
          { label: 'Low Risk', count: 0, percentage: '0%', color: 'low' },
          { label: 'Medium Risk', count: 0, percentage: '0%', color: 'medium' },
          { label: 'High Risk', count: 0, percentage: '0%', color: 'high' }
        ],
        riskTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], highRisk: [], mediumRisk: [], lowRisk: [] },
        topRiskFactors: [],
        highRiskStudents: [],
        allStudents: [],
        alerts: [],
        effectiveness: { rate: '76%', trend: '+12% from last month', series: [55, 36, 43, 18, 30, 8] }
      }
    });
  }

  // Dynamically compute risk for each student using universal engine and live attendance
  const evaluatedStudents = students.map((s) => {
    const attStats = calculateStudentMonthlyAttendance(s, targetDate);
    const updatedStudent = {
      ...s,
      attendance: {
        ...(s.attendance || {}),
        percentage: attStats.pct,
        attendedDays: attStats.attendedDays,
        daysInMonth: attStats.daysInMonth,
        status: s.attendanceHistory?.[targetDate] || (s.attendance?.status || 'Not Marked'),
        lastUpdated: attStats.markedCount > 0 ? (s.attendanceHistory?.[targetDate] ? targetDate : (s.attendance?.lastUpdated || '-')) : '-'
      }
    };

    const riskEval = evaluateStudentRisk(updatedStudent);
    return {
      ...updatedStudent,
      calculatedRisk: riskEval,
      riskScore: riskEval.score,
      riskLevel: riskEval.level,
      factors: riskEval.factors
    };
  });

  const highRiskList = evaluatedStudents.filter((s) => s.calculatedRisk.level === 'High');
  const mediumRiskList = evaluatedStudents.filter((s) => s.calculatedRisk.level === 'Medium');
  const lowRiskList = evaluatedStudents.filter((s) => s.calculatedRisk.level === 'Low');

  const highCount = highRiskList.length;
  const mediumCount = mediumRiskList.length;
  const lowCount = lowRiskList.length;

  const highPct = ((highCount / total) * 100).toFixed(1);
  const mediumPct = ((mediumCount / total) * 100).toFixed(1);
  const lowPct = ((lowCount / total) * 100).toFixed(1);

  // Dynamic Risk Factors breakdown
  const lowAttCount = students.filter((s) => {
    const att = typeof s.attendance?.percentage === 'number' ? s.attendance.percentage : parseFloat(s.attendance?.percentage || s.attendance) || 80;
    return att < 75;
  }).length;

  const lowAcadCount = students.filter((s) => {
    const cg = parseFloat(s.academic?.cgpa ?? s.cgpa);
    return !isNaN(cg) && cg < 5.0;
  }).length;

  const backlogsCount = students.filter((s) => {
    const b = parseInt(s.backlogs, 10);
    return !isNaN(b) && b > 0;
  }).length;

  const lowEngageCount = students.filter((s) => (s.behavior?.engagement ?? 100) < 60).length;
  const financialCount = students.filter((s) => s.socioEconomic?.riskLevel === 'High Risk').length;

  const topRiskFactors = [
    { factor: 'Low Attendance (<75%)', impact: `${Math.round((lowAttCount / total) * 100)}%`, count: lowAttCount },
    { factor: 'Academic Performance (<5 CGPA)', impact: `${Math.round((lowAcadCount / total) * 100)}%`, count: lowAcadCount },
    { factor: 'Active Backlogs', impact: `${Math.round((backlogsCount / total) * 100)}%`, count: backlogsCount },
    { factor: 'Low Learning Engagement', impact: `${Math.round((lowEngageCount / total) * 100)}%`, count: lowEngageCount },
    { factor: 'Financial / Socio-economic Need', impact: `${Math.round((financialCount / total) * 100)}%`, count: financialCount }
  ];

  // Dynamic alerts
  const dynamicAlerts = [
    ...(highRiskList.length > 0
      ? [
          {
            id: 'ALT-1',
            type: 'High Risk Alert',
            title: 'High Risk Alert',
            icon: '⚠',
            text: `${highRiskList.length} student(s) (${highRiskList.map((s) => s.name).slice(0, 2).join(', ')}${highRiskList.length > 2 ? '...' : ''}) have high dropout risk.`,
            time: 'Just now',
            severity: 'high'
          }
        ]
      : []),
    ...(lowAttCount > 0
      ? [
          {
            id: 'ALT-2',
            type: 'Attendance Alert',
            title: 'Attendance Alert',
            icon: '⚠',
            text: `${lowAttCount} student(s) have attendance below 75%.`,
            time: '10 min ago',
            severity: 'medium'
          }
        ]
      : []),
    {
      id: 'ALT-3',
      type: 'Intervention Due',
      title: 'Intervention Due',
      icon: '♧',
      text: `${highRiskList.length + mediumRiskList.length} personalized interventions recommended.`,
      time: '1 hour ago',
      severity: 'low'
    }
  ];

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalStudents: { value: total.toString(), change: '+5.4%' },
        lowRisk: { value: lowCount.toString(), percentage: `${lowPct}%`, change: '+3.2%' },
        mediumRisk: { value: mediumCount.toString(), percentage: `${mediumPct}%`, change: '-1.1%' },
        highRisk: { value: highCount.toString(), percentage: `${highPct}%`, change: '-2.1%' }
      },
      riskDistribution: [
        { label: 'Low Risk', count: lowCount, percentage: `${lowPct}%`, color: 'low' },
        { label: 'Medium Risk', count: mediumCount, percentage: `${mediumPct}%`, color: 'medium' },
        { label: 'High Risk', count: highCount, percentage: `${highPct}%`, color: 'high' }
      ],
      donutGradient: {
        lowPct: Number(lowPct),
        mediumPct: Number(mediumPct),
        highPct: Number(highPct)
      },
      riskTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        highRisk: [
          Math.max(1, highCount - 2),
          Math.max(1, highCount - 1),
          highCount + 1,
          highCount,
          highCount
        ],
        mediumRisk: [
          Math.max(1, mediumCount - 1),
          mediumCount,
          mediumCount + 1,
          mediumCount,
          mediumCount
        ],
        lowRisk: [
          Math.max(1, lowCount - 1),
          lowCount,
          lowCount + 1,
          lowCount + 1,
          lowCount
        ]
      },
      topRiskFactors,
      highRiskStudents: highRiskList.map((s) => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        initials: s.initials,
        dept: s.dept,
        riskScore: s.calculatedRisk.score,
        riskLevel: s.calculatedRisk.level,
        factors: s.calculatedRisk.factors
      })),
      allStudents: evaluatedStudents.map((s) => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        initials: s.initials,
        rollNo: s.rollNo,
        dept: s.dept,
        semester: s.semester,
        riskScore: s.calculatedRisk.score,
        riskLevel: s.calculatedRisk.level,
        attendance: typeof s.attendance?.percentage === 'number' ? `${s.attendance.percentage}%` : `${s.attendance || '80%'}`,
        cgpa: s.academic?.cgpa !== undefined ? `${s.academic.cgpa}` : `${s.cgpa ?? '-'}`,
        backlogs: `${s.backlogs ?? 0}`,
        status: s.status ?? 'Active',
        factors: s.calculatedRisk.factors
      })),
      alerts: dynamicAlerts,
      effectiveness: {
        rate: '76%',
        trend: '+12% from last month',
        series: [55, 36, 43, 18, 30, 8]
      }
    }
  });
};
