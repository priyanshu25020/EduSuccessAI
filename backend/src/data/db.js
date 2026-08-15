// backend/src/data/db.js - Core In-Memory & 78-Student Dataset Store for EduSuccess AI

const FIRST_NAMES = [
  'Rahul', 'Sneha', 'Aarav', 'Pooja', 'Karan', 'Anjali', 'Vivek', 'Neha',
  'Rohan', 'Priya', 'Aditya', 'Divya', 'Harsh', 'Tanvi', 'Siddharth', 'Riya',
  'Manish', 'Kavita', 'Arjun', 'Meera', 'Yash', 'Shruti', 'Varun', 'Deepika',
  'Gaurav', 'Ishita', 'Nikhil', 'Swati', 'Alok', 'Bhavna', 'Pranav', 'Ritu',
  'Akash', 'Shreya', 'Dev', 'Payal', 'Kunal', 'Sanya', 'Rajesh', 'Preeti',
  'Abhishek', 'Monika', 'Tushar', 'Geeta', 'Sanjay', 'Sunita', 'Vikram', 'Poonam',
  'Sameer', 'Jyoti', 'Tarun', 'Ananya', 'Mohit', 'Simran', 'Ashish', 'Komal',
  'Mayank', 'Pallavi', 'Hemant', 'Nisha', 'Chirag', 'Radha', 'Lalit', 'Sapna',
  'Deepak', 'Garima', 'Suraj', 'Vandana', 'Aman', 'Kiran', 'Jay', 'Shikha',
  'Sandeep', 'Barkha', 'Pankaj', 'Aarti', 'Umesh', 'Rekha'
];

const LAST_NAMES = [
  'Patel', 'Singh', 'Mehta', 'Sharma', 'Verma', 'Desai', 'Yadav', 'Patel',
  'Joshi', 'Nair', 'Kulkarni', 'Iyer', 'Vardhan', 'Rao', 'Gupta', 'Sengupta',
  'Choudhury', 'Bhatia', 'Reddy', 'Menon', 'Shah', 'Mishra', 'Kapoor', 'Dutta',
  'Agarwal', 'Chatterjee', 'Malhotra', 'Pandey', 'Saxena', 'Trivedi', 'Bansal', 'Thakur',
  'Chauhan', 'Dubey', 'Soni', 'Mukherjee', 'Bose', 'Garg', 'Chopra', 'Shukla',
  'Mahajan', 'Ghosh', 'Rathore', 'Chhabra', 'Pillai', 'Rangan', 'Bhatt', 'Nambiar',
  'Sinha', 'Chaudhary', 'Gokhale', 'Majumdar', 'Bhardwaj', 'Acharya', 'Dhar', 'Kashyap',
  'Goswami', 'Rastogi', 'Nath', 'Khurana', 'Bakshi', 'Kaul', 'Sethi', 'Trehan',
  'Dhiman', 'Dewan', 'Biswas', 'Chandra', 'Mandal', 'Manna', 'Pramanik', 'Samanta',
  'Sen', 'Bhattacharya', 'Karmakar', 'Roy', 'Barman', 'Kundu'
];

const DEPTS = [
  { name: 'Computer Engg.', prefix: 'CE', subjects: ['Data Structures', 'Operating Systems', 'Algorithms', 'Computer Networks'] },
  { name: 'Information Tech.', prefix: 'IT', subjects: ['Database Mgmt.', 'Web Development', 'Cloud Computing', 'Information Security'] },
  { name: 'Electronics Engg.', prefix: 'EE', subjects: ['Digital Logic', 'Microprocessors', 'VLSI Design', 'Signals & Systems'] },
  { name: 'Mechanical Engg.', prefix: 'ME', subjects: ['Thermodynamics', 'Machine Design', 'Fluid Mechanics', 'Manufacturing Tech.'] },
  { name: 'Civil Engg.', prefix: 'CV', subjects: ['Structural Analysis', 'Geotechnical Engg.', 'Surveying', 'Hydraulics'] }
];

const AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
];

const students = Array.from({ length: 78 }, (_, i) => {
  const deptObj = DEPTS[i % DEPTS.length];
  const rollIndex = String(Math.floor(i / DEPTS.length) + 1).padStart(3, '0');
  const semester = (i % 8) + 1;
  const section = i % 4 < 2 ? 'Section A' : 'Section B';
  const subject = deptObj.subjects[i % deptObj.subjects.length];
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const rollNo = `${deptObj.prefix}2021${rollIndex}`;
  const id = `STU${1001 + i}`;
  const cgpa = parseFloat((3.4 + ((i * 17) % 55) / 10).toFixed(2));
  const backlogs = (i * 7) % 4;

  return {
    id,
    name: fullName,
    rollNo,
    avatar: AVATARS[i % AVATARS.length],
    initials: `${firstName[0]}${lastName[0]}`,
    dept: deptObj.name,
    semester,
    section,
    cgpa,
    backlogs,
    status: 'Active',
    totalLectures: 48,
    attendedLectures: 0,
    attendanceHistory: {},
    attendance: {
      percentage: 0,
      totalLectures: 48,
      attendedLectures: 0,
      status: 'Not Marked',
      subject,
      section,
      lastUpdated: '-'
    },
    academic: {
      cgpa,
      grade: cgpa >= 7.5 ? 'A' : cgpa >= 6.0 ? 'B' : cgpa >= 4.0 ? 'C' : 'F',
      marks: Math.round(cgpa * 9.5),
      atRisk: cgpa < 5.0 || backlogs > 1
    },
    behavior: {
      studyTime: `${1 + (i % 3)}h ${(i * 15) % 60}m`,
      studyTimeHours: 1.5 + (i % 3),
      consistency: 50 + (i * 7) % 45,
      engagement: 45 + (i * 9) % 50,
      style: i % 4 === 0 ? 'Visual Learner' : i % 4 === 1 ? 'Auditory Learner' : i % 4 === 2 ? 'Read/Write Learner' : 'Kinesthetic Learner',
      riskLevel: cgpa < 4.5 ? 'High' : cgpa < 6.5 ? 'Medium' : 'Low'
    },
    socioEconomic: {
      riskLevel: i % 3 === 0 ? 'High Risk' : i % 3 === 1 ? 'Moderate Risk' : 'Low Risk',
      income: i % 3 === 0 ? '< ₹1,00,000' : i % 3 === 1 ? '₹1,00,000 - ₹2,00,000' : '> ₹2,00,000',
      education: i % 2 === 0 ? 'Up to 10th' : 'Graduate',
      location: i % 2 === 0 ? 'Rural' : 'Urban',
      firstGen: i % 3 === 0,
      singleParent: i % 5 === 0,
      resourceAccess: 40 + (i * 8) % 55
    },
    risk: {
      score: `${Math.min(100, Math.max(5, Math.round((10 - cgpa) * 10 + backlogs * 12)))}%`,
      level: cgpa < 4.5 || backlogs >= 2 ? 'High' : cgpa < 6.0 ? 'Medium' : 'Low',
      factors: `${backlogs > 0 ? `${backlogs} Backlog(s)` : 'Stable'}`
    }
  };
});

const alerts = [
  {
    id: 'ALT-1',
    type: 'Dropout Alert',
    title: 'Dropout Alert',
    icon: '⚠',
    text: 'High dropout risk detected for 12 students with critical backlogs.',
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
  }
];

module.exports = {
  students,
  alerts
};
