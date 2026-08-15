// frontend/src/data/studentsData.js
// Complete Real Institutional Student Dataset (78 Students Across 5 Departments)

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

const AVATAR_POOL = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
];

export const ALL_78_STUDENTS = Array.from({ length: 78 }, (_, i) => {
  const deptObj = DEPTS[i % DEPTS.length];
  const rollIndex = String(Math.floor(i / DEPTS.length) + 1).padStart(3, '0');
  const semester = i % 2 === 0 ? 4 : 6;
  const section = i % 4 < 2 ? 'Section A' : 'Section B';
  const subject = deptObj.subjects[i % deptObj.subjects.length];
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const rollNo = `${deptObj.prefix}2021${rollIndex}`;
  const id = `STU${1001 + i}`;

  // Default Lecture counts: e.g. 48 total conducted lectures
  const totalLectures = 48;
  const initialAttended = 0; // Default Not Marked / 0 attended until marked
  const initialPct = 0;

  return {
    id,
    rollNo,
    name: fullName,
    avatar: AVATAR_POOL[i % AVATAR_POOL.length],
    initials: `${firstName[0]}${lastName[0]}`,
    dept: deptObj.name,
    semester,
    section,
    subject,
    status: 'Not Marked',
    totalLectures,
    attendedLectures: initialAttended,
    attendancePct: initialPct,
    lastUpdated: '-',
    integrity: 'Not Marked',
    hash: `0x${deptObj.prefix.toLowerCase()}${1000 + i}${Date.now().toString(16).slice(-6)}`,
    cgpa: parseFloat((4.5 + ((i * 13) % 45) / 10).toFixed(2)),
    backlogs: (i * 7) % 4
  };
});

export default ALL_78_STUDENTS;
