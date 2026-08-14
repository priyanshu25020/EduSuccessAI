// backend/src/controllers/socioEconomicController.js
const { students } = require('../data/db');

exports.getSocioEconomicStats = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      lowRisk: { value: '2,148', percentage: '39.6%' },
      mediumRisk: { value: '2,376', percentage: '43.8%' },
      highRisk: { value: '896', percentage: '16.5%' },
      needsImmediateSupport: { value: '214', percentage: '3.9%' }
    }
  });
};

exports.getSocioEconomicOverview = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      riskDistribution: [
        { label: 'Low Risk', percentage: 39.6, count: 2148, color: '#10b981' },
        { label: 'Medium Risk', percentage: 43.8, count: 2376, color: '#f59e0b' },
        { label: 'High Risk', percentage: 16.5, count: 896, color: '#ef4444' },
        { label: 'Needs Immediate Support', percentage: 3.9, count: 214, color: '#8b5cf6' }
      ],
      byDepartment: [
        { name: 'Computer Engg.', low: 42, medium: 44, high: 11, support: 3 },
        { name: 'Information Tech.', low: 38, medium: 45, high: 13, support: 4 },
        { name: 'Electronics Engg.', low: 36, medium: 42, high: 17, support: 5 },
        { name: 'Mechanical Engg.', low: 40, medium: 41, high: 15, support: 4 },
        { name: 'Civil Engg.', low: 30, medium: 47, high: 17, support: 6 }
      ],
      keyFactors: [
        { name: 'Parental Education (Low)', percentage: 52, icon: 'graduation' },
        { name: 'Family Income (Low)', percentage: 48, icon: 'rupee' },
        { name: 'First Generation Learners', percentage: 41, icon: 'award' },
        { name: 'Single Parent Family', percentage: 18, icon: 'user' },
        { name: 'Rural Background', percentage: 35, icon: 'home' },
        { name: 'Access to Learning Resources', percentage: 47, icon: 'laptop' }
      ],
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        dept: s.dept,
        semester: s.semester,
        riskLevel: s.socioEconomic.riskLevel,
        riskClass: s.socioEconomic.riskClass,
        income: s.socioEconomic.income,
        education: s.socioEconomic.education,
        location: s.socioEconomic.location
      })),
      trend: {
        dates: ['20 Apr', '27 Apr', '4 May', '11 May', '18 May'],
        lowRisk: [800, 810, 830, 825, 840],
        mediumRisk: [600, 605, 620, 620, 630],
        highRisk: [350, 355, 355, 355, 360],
        needsSupport: [200, 202, 204, 204, 205]
      },
      insight: 'Students from low income families are 2.3x more likely to be at academic risk.'
    }
  });
};
