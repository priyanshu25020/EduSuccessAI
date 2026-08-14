// backend/src/controllers/behaviorController.js
const { students } = require('../data/db');

exports.getBehaviorStats = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      avgStudyTime: { value: '2h 35m', change: '+18% from last month' },
      learningConsistency: { value: '76%', change: '+9% from last month' },
      engagementScore: { value: '68 / 100', change: '+7 points from last month' },
      activeLearners: { value: '3,856', percentage: '72% of total students' },
      atRisk: { value: '712', percentage: '13.2% of total students' }
    }
  });
};

exports.getBehaviorOverview = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      radar: {
        axes: ['Study Time', 'Class Participation', 'Assignment Submission', 'Resource Utilization', 'Self Learning'],
        currentMonth: [75, 68, 82, 70, 78],
        lastMonth: [65, 62, 74, 58, 64],
        callout: 'Students are spending more time on self learning and resource utilization.'
      },
      engagementTrend: {
        timeframe: 'This Month',
        change: '+10% improvement in engagement from last month',
        points: [
          { date: '7 Apr', score: 61 },
          { date: '14 Apr', score: 63 },
          { date: '21 Apr', score: 65 },
          { date: '28 Apr', score: 66 },
          { date: '5 May', score: 69 },
          { date: '12 May', score: 68 }
        ]
      },
      activityDistribution: [
        { label: 'Video Lectures', percentage: 35, count: 1890, color: '#7c3aed' },
        { label: 'Reading Materials', percentage: 25, count: 1350, color: '#3b82f6' },
        { label: 'Practice & Quizzes', percentage: 20, count: 1080, color: '#10b981' },
        { label: 'Assignments', percentage: 12, count: 648, color: '#f97316' },
        { label: 'Discussions', percentage: 8, count: 432, color: '#f43f5e' }
      ],
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        studyTime: s.behavior.studyTime,
        consistency: s.behavior.consistency,
        engagement: s.behavior.engagement,
        style: s.behavior.style,
        styleClass: s.behavior.styleClass,
        riskLevel: s.behavior.riskLevel
      })),
      keyInsights: [
        { id: 1, text: 'Students who study more than 2 hours daily have 2.5x better academic performance.', icon: 'trending' },
        { id: 2, text: 'Consistency in learning is the top predictor of student success.', icon: 'clock' },
        { id: 3, text: 'Interactive content boosts engagement by 35% on average.', icon: 'layers' }
      ],
      recommendedActions: [
        { id: 1, text: 'Encourage low engagement students with personalized plans', icon: 'users', color: 'green' },
        { id: 2, text: 'Assign mentors to high risk students', icon: 'award', color: 'blue' },
        { id: 3, text: 'Share engaging resources & interactive materials', icon: 'sparkles', color: 'purple' }
      ]
    }
  });
};
