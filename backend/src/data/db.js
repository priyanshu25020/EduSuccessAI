// backend/src/data/db.js - Core In-Memory & 80-Student Dataset Store for EduSuccess AI

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
  'Sandeep', 'Barkha', 'Pankaj', 'Aarti', 'Umesh', 'Rekha', 'Abhay', 'Brijesh'
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
  'Sen', 'Bhattacharya', 'Karmakar', 'Roy', 'Barman', 'Kundu', 'Mali', 'Jain'
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

const students = Array.from({ length: 80 }, (_, i) => {
  const deptObj = DEPTS[i % DEPTS.length];
  const rollIndex = String(Math.floor(i / DEPTS.length) + 1).padStart(3, '0');
  const semester = (i % 8) + 1;
  const sections = ['Section A', 'Section B', 'Section C', 'Section D'];
  const section = sections[i % sections.length];
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
      lastUpdated: '-'
    },
    academic: {
      cgpa,
      currentSemester: semester,
      backlogsCount: backlogs,
      assignmentCompletion: `${Math.min(100, Math.max(30, 100 - backlogs * 18))}%`,
      midSemScore: `${Math.round(cgpa * 9.5)}/100`,
      endSemPredicted: `${Math.round(cgpa * 9.2)}/100`
    },
    risk: {
      score: `${Math.min(95, Math.max(10, Math.round(100 - (cgpa * 6 + 30) + backlogs * 12)))}%`,
      level: cgpa < 5.0 || backlogs >= 2 ? 'High' : cgpa < 6.8 ? 'Medium' : 'Low',
      factors: [
        backlogs > 0 ? `${backlogs} Active Backlog(s)` : 'Clear Academic History',
        cgpa < 6.0 ? `Low CGPA (${cgpa}/10)` : `Stable CGPA (${cgpa}/10)`,
        'Awaiting Lecture Session'
      ]
    },
    mentor: {
      name: 'Prof. Ananya Roy',
      email: 'ananya.roy@edusuccess.edu',
      notes: backlogs > 0 ? 'Remedial coaching recommended for pending subjects.' : 'Standard progression.'
    }
  };
});

const alerts = [
  { id: 'ALT-101', studentId: 'STU1001', type: 'High Risk', message: 'Attendance below 75% threshold in Data Structures', time: '10 mins ago', read: false },
  { id: 'ALT-102', studentId: 'STU1002', type: 'Critical', message: '3 Active backlogs flagged in 6th semester', time: '1 hour ago', read: false },
  { id: 'ALT-103', studentId: 'STU1005', type: 'Warning', message: 'Mid-term evaluation score dropped below 40%', time: '3 hours ago', read: true }
];

module.exports = {
  students,
  alerts
};
