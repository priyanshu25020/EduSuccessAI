// backend/src/data/db.js - Core In-Memory & Seed Data Store for EduSuccess AI

const students = [
  {
    id: 'STU1001',
    name: 'Rahul Patel',
    rollNo: 'CE2021001',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    initials: 'RP',
    dept: 'Computer Engg.',
    semester: 4,
    section: 'Section A',
    cgpa: 5.8,
    backlogs: 2,
    status: 'Active',
    attendance: {
      percentage: 87,
      status: 'Present',
      subject: 'Data Structures',
      section: 'Section A',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 5.8,
      grade: 'B',
      marks: 72,
      atRisk: false
    },
    behavior: {
      studyTime: '3h 10m',
      studyTimeHours: 3.16,
      consistency: 82,
      engagement: 78,
      style: 'Visual Learner',
      styleClass: 'visual',
      riskLevel: 'Low'
    },
    socioEconomic: {
      riskLevel: 'High Risk',
      riskClass: 'red',
      income: '< ₹1,00,000',
      education: 'Up to 10th',
      location: 'Rural',
      firstGen: true,
      singleParent: false,
      resourceAccess: 40
    },
    risk: {
      score: '8%',
      level: 'Low',
      factors: '2 Backlog(s)'
    }
  },
  {
    id: 'STU1002',
    name: 'Sneha Singh',
    rollNo: 'IT2021002',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'SS',
    dept: 'Information Tech.',
    semester: 4,
    section: 'Section B',
    cgpa: 6.2,
    backlogs: 1,
    status: 'Active',
    attendance: {
      percentage: 92,
      status: 'Present',
      subject: 'Database Mgmt.',
      section: 'Section B',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 6.2,
      grade: 'B+',
      marks: 78,
      atRisk: false
    },
    behavior: {
      studyTime: '2h 25m',
      studyTimeHours: 2.41,
      consistency: 74,
      engagement: 68,
      style: 'Auditory Learner',
      styleClass: 'auditory',
      riskLevel: 'Medium'
    },
    socioEconomic: {
      riskLevel: 'Medium Risk',
      riskClass: 'amber',
      income: '₹1,00,000 - ₹2,00,000',
      education: '12th',
      location: 'Semi-Urban',
      firstGen: false,
      singleParent: true,
      resourceAccess: 65
    },
    risk: {
      score: '8%',
      level: 'Low',
      factors: '1 Backlog(s)'
    }
  },
  {
    id: 'STU1003',
    name: 'Aarav Mehta',
    rollNo: 'EE2021003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    initials: 'AM',
    dept: 'Electronics Engg.',
    semester: 4,
    section: 'Section A',
    cgpa: 3.65,
    backlogs: 3,
    status: 'Active',
    attendance: {
      percentage: 45,
      status: 'Absent',
      subject: 'Digital Logic',
      section: 'Section A',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 3.65,
      grade: 'D',
      marks: 42,
      atRisk: true
    },
    behavior: {
      studyTime: '1h 45m',
      studyTimeHours: 1.75,
      consistency: 58,
      engagement: 52,
      style: 'Read/Write Learner',
      styleClass: 'readwrite',
      riskLevel: 'High'
    },
    socioEconomic: {
      riskLevel: 'Low Risk',
      riskClass: 'green',
      income: '> ₹2,00,000',
      education: 'Graduate',
      location: 'Urban',
      firstGen: false,
      singleParent: false,
      resourceAccess: 80
    },
    risk: {
      score: '93%',
      level: 'High',
      factors: 'Low Attendance (<60%), Low CGPA (<4.0), 3 Active Backlogs'
    }
  },
  {
    id: 'STU1004',
    name: 'Pooja Sharma',
    rollNo: 'ME2021004',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    initials: 'PS',
    dept: 'Mechanical Engg.',
    semester: 4,
    section: 'Section B',
    cgpa: 3.89,
    backlogs: 2,
    status: 'Active',
    attendance: {
      percentage: 68,
      status: 'Absent',
      subject: 'Thermodynamics',
      section: 'Section B',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 3.89,
      grade: 'C-',
      marks: 52,
      atRisk: true
    },
    behavior: {
      studyTime: '1h 20m',
      studyTimeHours: 1.33,
      consistency: 54,
      engagement: 48,
      style: 'Visual Learner',
      styleClass: 'visual',
      riskLevel: 'High'
    },
    socioEconomic: {
      riskLevel: 'High Risk',
      riskClass: 'red',
      income: '< ₹1,00,000',
      education: 'Up to 10th',
      location: 'Rural',
      firstGen: true,
      singleParent: false,
      resourceAccess: 35
    },
    risk: {
      score: '63%',
      level: 'High',
      factors: 'Attendance Below 75%, Low CGPA (<4.0), 2 Backlog(s)'
    }
  },
  {
    id: 'STU1005',
    name: 'Karan Verma',
    rollNo: 'CE2021005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    initials: 'KV',
    dept: 'Computer Engg.',
    semester: 6,
    section: 'Section A',
    cgpa: 4.12,
    backlogs: 3,
    status: 'Active',
    attendance: {
      percentage: 83,
      status: 'Present',
      subject: 'Operating Systems',
      section: 'Section A',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 4.12,
      grade: 'C',
      marks: 61,
      atRisk: true
    },
    behavior: {
      studyTime: '2h 10m',
      studyTimeHours: 2.16,
      consistency: 68,
      engagement: 62,
      style: 'Kinesthetic Learner',
      styleClass: 'kinesthetic',
      riskLevel: 'Medium'
    },
    socioEconomic: {
      riskLevel: 'Medium Risk',
      riskClass: 'amber',
      income: '₹1,00,000 - ₹2,00,000',
      education: '12th',
      location: 'Semi-Urban',
      firstGen: false,
      singleParent: false,
      resourceAccess: 60
    },
    risk: {
      score: '50%',
      level: 'Medium',
      factors: 'CGPA Below 5.5, 3 Active Backlogs'
    }
  },
  {
    id: 'STU1006',
    name: 'Anjali Desai',
    rollNo: 'IT2021006',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    initials: 'AD',
    dept: 'Information Tech.',
    semester: 6,
    section: 'Section B',
    cgpa: 8.45,
    backlogs: 0,
    status: 'Active',
    attendance: {
      percentage: 90,
      status: 'Present',
      subject: 'Web Development',
      section: 'Section B',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 8.45,
      grade: 'A',
      marks: 89,
      atRisk: false
    },
    behavior: {
      studyTime: '3h 30m',
      studyTimeHours: 3.5,
      consistency: 88,
      engagement: 84,
      style: 'Visual Learner',
      styleClass: 'visual',
      riskLevel: 'Low'
    },
    socioEconomic: {
      riskLevel: 'Low Risk',
      riskClass: 'green',
      income: '> ₹2,00,000',
      education: 'Post Graduate',
      location: 'Urban',
      firstGen: false,
      singleParent: false,
      resourceAccess: 90
    },
    risk: {
      score: '0%',
      level: 'Low',
      factors: 'Stable'
    }
  },
  {
    id: 'STU1007',
    name: 'Vivek Yadav',
    rollNo: 'EE2021007',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    initials: 'VY',
    dept: 'Electronics Engg.',
    semester: 6,
    section: 'Section A',
    cgpa: 3.78,
    backlogs: 2,
    status: 'Active',
    attendance: {
      percentage: 72,
      status: 'Absent',
      subject: 'Microprocessors',
      section: 'Section A',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 3.78,
      grade: 'D+',
      marks: 48,
      atRisk: true
    },
    behavior: {
      studyTime: '1h 50m',
      studyTimeHours: 1.83,
      consistency: 60,
      engagement: 55,
      style: 'Auditory Learner',
      styleClass: 'auditory',
      riskLevel: 'High'
    },
    socioEconomic: {
      riskLevel: 'Medium Risk',
      riskClass: 'amber',
      income: '₹1,00,000 - ₹2,00,000',
      education: 'Graduate',
      location: 'Rural',
      firstGen: true,
      singleParent: false,
      resourceAccess: 50
    },
    risk: {
      score: '71%',
      level: 'High',
      factors: 'Attendance Below 75%, Low CGPA (<4.0), 2 Backlog(s)'
    }
  },
  {
    id: 'STU1008',
    name: 'Neha Patel',
    rollNo: 'ME2021008',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    initials: 'NP',
    dept: 'Mechanical Engg.',
    semester: 6,
    section: 'Section B',
    cgpa: 3.42,
    backlogs: 4,
    status: 'Active',
    attendance: {
      percentage: 30,
      status: 'Absent',
      subject: 'Machine Design',
      section: 'Section B',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa: 3.42,
      grade: 'F',
      marks: 38,
      atRisk: true
    },
    behavior: {
      studyTime: '1h 10m',
      studyTimeHours: 1.16,
      consistency: 45,
      engagement: 40,
      style: 'Kinesthetic Learner',
      styleClass: 'kinesthetic',
      riskLevel: 'High'
    },
    socioEconomic: {
      riskLevel: 'High Risk',
      riskClass: 'red',
      income: '< ₹1,00,000',
      education: 'Up to 10th',
      location: 'Rural',
      firstGen: true,
      singleParent: true,
      resourceAccess: 30
    },
    risk: {
      score: '100%',
      level: 'High',
      factors: 'Low Attendance (<60%), Low CGPA (<4.0), 4 Active Backlogs'
    }
  }
];

const alerts = [
  {
    id: 'ALT-1',
    type: 'Dropout Alert',
    title: 'Dropout Alert',
    icon: '⚠',
    text: 'High dropout risk detected for 4 students with critical backlogs.',
    time: '2 hours ago',
    severity: 'high'
  },
  {
    id: 'ALT-2',
    type: 'Attendance Alert',
    title: 'Attendance Alert',
    icon: '⚠',
    text: 'Attendance dropped below 60% in Electronics & Mechanical Engg.',
    time: '4 hours ago',
    severity: 'medium'
  },
  {
    id: 'ALT-3',
    type: 'Intervention Due',
    title: 'Intervention Due',
    icon: '♧',
    text: 'Schedule counseling session with Neha Patel & Aarav Mehta.',
    time: 'Yesterday',
    severity: 'low'
  }
];

module.exports = {
  students,
  alerts
};
