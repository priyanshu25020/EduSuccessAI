// backend/src/controllers/academicController.js
const { students } = require('../data/db');

exports.getAcademicStats = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      averageCGPA: { value: 7.42, max: 10, change: '+0.38 from last month' },
      above7CGPA: { value: '2,814', percentage: '52.1%' },
      below5CGPA: { value: '736', percentage: '13.6%' },
      topPerforming: { value: '428', percentage: '7.9%' },
      atRisk: { value: '736', percentage: '13.6% need improvement' }
    }
  });
};

exports.getAcademicOverview = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      cgpaDistribution: [
        { range: '9 - 10 (Excellent)', percentage: 18, count: 974, color: '#10b981' },
        { range: '7 - 8.9 (Good)', percentage: 32, count: 1734, color: '#84cc16' },
        { range: '6 - 6.9 (Average)', percentage: 28, count: 1518, color: '#eab308' },
        { range: '5 - 5.9 (Below Average)', percentage: 15, count: 812, color: '#f97316' },
        { range: '< 5 (Poor)', percentage: 7, count: 382, color: '#ef4444' }
      ],
      cgpaTrend: {
        timeframe: 'This Semester',
        change: '+0.78 improvement from last semester',
        points: [
          { week: 'Week 1', cgpa: 6.72 },
          { week: 'Week 2', cgpa: 6.91 },
          { week: 'Week 3', cgpa: 7.05 },
          { week: 'Week 4', cgpa: 7.28 },
          { week: 'Week 5', cgpa: 7.34 },
          { week: 'Week 6', cgpa: 7.42 },
          { week: 'Week 7', cgpa: 7.50 }
        ]
      },
      topSubjects: [
        { name: 'Data Structures', cgpa: 8.62, percentage: 86, color: '#10b981', icon: 'blue' },
        { name: 'Database Management', cgpa: 8.15, percentage: 81, color: '#10b981', icon: 'green' },
        { name: 'Operating Systems', cgpa: 7.98, percentage: 79, color: '#3b82f6', icon: 'pink' },
        { name: 'Computer Networks', cgpa: 7.74, percentage: 77, color: '#3b82f6', icon: 'cyan' },
        { name: 'Software Engineering', cgpa: 7.48, percentage: 74, color: '#3b82f6', icon: 'orange' }
      ],
      subjectsOverview: [
        { name: 'Data Structures', enrolled: '1,256', avgMarks: 86.2, grade: 'A', gradeClass: 'green', passPct: 96, trend: 'up' },
        { name: 'Database Management', enrolled: '1,198', avgMarks: 81.5, grade: 'A-', gradeClass: 'green', passPct: 94, trend: 'up' },
        { name: 'Operating Systems', enrolled: '1,245', avgMarks: 79.8, grade: 'B+', gradeClass: 'blue', passPct: 91, trend: 'up' },
        { name: 'Computer Networks', enrolled: '1,182', avgMarks: 77.4, grade: 'B+', gradeClass: 'blue', passPct: 89, trend: 'up' },
        { name: 'Software Engineering', enrolled: '1,130', avgMarks: 74.8, grade: 'B', gradeClass: 'amber', passPct: 87, trend: 'down' }
      ],
      atRiskStudents: students
        .filter((s) => s.academic.cgpa < 5)
        .map((s) => ({
          id: s.id,
          name: s.name,
          dept: s.dept,
          avatar: s.avatar,
          cgpa: s.academic.cgpa,
          severity: s.academic.cgpa < 3.8 ? 'red' : 'amber'
        })),
      insight: 'Students who attend classes regularly and submit assignments on time have 2.3x better academic performance.'
    }
  });
};
