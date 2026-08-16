// frontend/src/data/studentDetailHelpers.js
// 7-Pillar Multi-Dimensional AI Student Evaluation & Detailed Diagnostic Generator

// Subject list per department
const DEPT_SUBJECTS = {
  'Computer Engg.': [
    { code: 'CS401', name: 'Data Structures & Algorithms', faculty: 'Prof. Ananya Roy' },
    { code: 'CS402', name: 'Operating Systems Architecture', faculty: 'Dr. S. K. Gupta' },
    { code: 'CS403', name: 'Database Management Systems', faculty: 'Prof. Neha Trivedi' },
    { code: 'CS404', name: 'Computer Networks & Security', faculty: 'Prof. Rajesh Kulkarni' }
  ],
  'Information Tech.': [
    { code: 'IT401', name: 'Database Management Systems', faculty: 'Dr. Meera Nambiar' },
    { code: 'IT402', name: 'Full-Stack Web Development', faculty: 'Prof. Alok Sharma' },
    { code: 'IT403', name: 'Cloud Computing Infrastructure', faculty: 'Prof. Priya Joshi' },
    { code: 'IT404', name: 'Information Security & Cryptography', faculty: 'Dr. Haresh Patel' }
  ],
  'Electronics Engg.': [
    { code: 'EE401', name: 'Digital Logic & Microprocessors', faculty: 'Dr. Rajesh Sharma' },
    { code: 'EE402', name: 'VLSI Circuit Design', faculty: 'Prof. Amit Saxena' },
    { code: 'EE403', name: 'Signals & Linear Systems', faculty: 'Prof. Kavita Rao' },
    { code: 'EE404', name: 'Analog Communication', faculty: 'Dr. Tarun Verma' }
  ],
  'Mechanical Engg.': [
    { code: 'ME401', name: 'Applied Thermodynamics', faculty: 'Prof. Vikram Bhatt' },
    { code: 'ME402', name: 'Machine Design & Kinematics', faculty: 'Dr. Sanjay Deshmukh' },
    { code: 'ME403', name: 'Fluid Mechanics & Turbines', faculty: 'Prof. Manish Mehta' },
    { code: 'ME404', name: 'Manufacturing Technology Lab', faculty: 'Prof. Poonam Yadav' }
  ],
  'Civil Engg.': [
    { code: 'CV401', name: 'Structural Analysis & Mechanics', faculty: 'Prof. Suresh Joshi' },
    { code: 'CV402', name: 'Geotechnical & Soil Engg.', faculty: 'Dr. Rekha Choudhury' },
    { code: 'CV403', name: 'Surveying & Geomatics', faculty: 'Prof. Lalit Bansal' },
    { code: 'CV404', name: 'Hydraulics & Water Resources', faculty: 'Dr. Garima Trivedi' }
  ]
};

// Generate comprehensive 7-factor profile for any student
export const getStudentDeepProfile = (student) => {
  if (!student) return null;

  const idNum = parseInt(student.id?.replace('STU', '') || '1001', 10);
  const deptName = student.dept || 'Computer Engg.';
  const subjects = DEPT_SUBJECTS[deptName] || DEPT_SUBJECTS['Computer Engg.'];
  const sem = parseInt(student.semester, 10) || 4;
  const baseCgpa = parseFloat(student.cgpa || 5.5);
  const baseAtt = parseFloat(student.attendancePct !== undefined ? student.attendancePct : (parseFloat(student.attendance) || 65));
  const backlogsCount = parseInt(student.backlogs !== undefined ? student.backlogs : 0, 10);

  // 1. Pillar 1: Subject-Wise Attendance Breakdown
  const subjectAttendance = subjects.map((sub, sIdx) => {
    const totalLecs = 12;
    let attPct = 0;
    let attended = 0;
    if (baseAtt > 0) {
      const variance = ((idNum * 7 + sIdx * 13) % 16) - 8;
      attPct = Math.min(100, Math.max(5, Math.round(baseAtt + variance)));
      attended = Math.round((attPct / 100) * totalLecs);
    }

    return {
      code: sub.code,
      name: sub.name,
      faculty: sub.faculty,
      totalLectures: totalLecs,
      attendedLectures: attended,
      percentage: attPct,
      status: attPct >= 75 ? 'Safe' : attPct >= 60 ? 'Warning' : (baseAtt === 0 ? 'Not Marked' : 'Critical')
    };
  });

  // 2. Pillar 2: Academic CGPA (Per-Semester, Mid-Term & Final Exams)
  const semesterProgression = [];
  for (let s = 1; s <= sem; s++) {
    const semVariance = ((idNum * 11 + s * 9) % 20) / 10 - 1.0;
    const semCgpa = Math.min(9.8, Math.max(3.2, parseFloat((baseCgpa + (s === sem ? 0 : semVariance)).toFixed(2))));
    const midExam = Math.min(95, Math.max(30, Math.round(semCgpa * 9.5 + ((idNum + s * 4) % 10) - 5)));
    const finalExam = Math.min(95, Math.max(32, Math.round(semCgpa * 9.2 + ((idNum * 2 + s) % 8) - 4)));

    semesterProgression.push({
      semester: `Sem ${s}`,
      cgpa: semCgpa,
      midExamMarks: midExam,
      finalExamMarks: finalExam,
      status: semCgpa >= 7.5 ? 'Distinction' : semCgpa >= 6.0 ? 'First Class' : semCgpa >= 4.5 ? 'Pass' : 'Critical Risk'
    });
  }

  // 3. Pillar 3: Assignment Submissions (Subject-Wise & Timeline)
  const assignments = [
    {
      title: 'Lab Assignment 1: Fundamental Concepts & Problem Solving',
      subject: subjects[0]?.name || 'Core Module',
      dueDate: '02 Aug 2026',
      submittedDate: '01 Aug 2026',
      status: 'On-Time',
      score: '9/10',
      grade: 'A'
    },
    {
      title: 'Practical Sheet 2: Architectural Simulation & Case Study',
      subject: subjects[1]?.name || 'Core Module 2',
      dueDate: '08 Aug 2026',
      submittedDate: (idNum % 3 === 0) ? '11 Aug 2026' : '07 Aug 2026',
      status: (idNum % 3 === 0) ? 'Late (+3 Days)' : 'On-Time',
      score: (idNum % 3 === 0) ? '6/10' : '8.5/10',
      grade: (idNum % 3 === 0) ? 'C' : 'B+'
    },
    {
      title: 'Mid-Term Project: Prototype Design & Source Code',
      subject: subjects[2]?.name || 'Core Module 3',
      dueDate: '14 Aug 2026',
      submittedDate: (baseCgpa < 5.0) ? 'Pending' : '14 Aug 2026',
      status: (baseCgpa < 5.0) ? 'Missing / Overdue' : 'On-Time',
      score: (baseCgpa < 5.0) ? '0/10' : '9/10',
      grade: (baseCgpa < 5.0) ? 'F' : 'A'
    }
  ];

  // 4. Pillar 4: Backlogs History (Semester-Wise)
  const backlogsHistory = [];
  if (backlogsCount > 0) {
    for (let b = 0; b < backlogsCount; b++) {
      const bSem = Math.max(1, sem - 1 - (b % 2));
      const bSub = subjects[(b + 1) % subjects.length]?.name || 'Applied Mathematics';
      backlogsHistory.push({
        code: `SUB-B0${b + 1}`,
        subjectName: bSub,
        semester: `Semester ${bSem}`,
        status: 'Active (Pending Remedial Exam)',
        attempts: 1 + (b % 2),
        scheduledExam: 'Sep 2026 Supplementary Batch'
      });
    }
  }

  // 5. Pillar 5: Co-Curricular Activities & Verifiable Certificate
  const activities = [
    {
      id: `ACT-${idNum}-1`,
      title: 'Smart India Hackathon & Innovation Challenge',
      category: 'Technical Hackathon',
      date: '15 Jul 2026',
      role: 'Core Team Participant',
      award: (idNum % 2 === 0) ? '1st Runner Up (Zone Level)' : 'National Round Participant',
      certificate: {
        certId: `CERT-SIH-2026-${idNum}9A`,
        title: 'Certificate of Excellence in Engineering Innovation',
        issuer: 'Institutional Innovation Council & Ministry of Education',
        date: '18 Jul 2026',
        recipient: student.name,
        rollNo: student.rollNo,
        dept: student.dept,
        seal: 'AICTE_APPROVED_VERIFIED',
        hash: `0x${student.rollNo?.toLowerCase() || 'stu'}cert9918a2b3c4`
      }
    },
    {
      id: `ACT-${idNum}-2`,
      title: 'Inter-Departmental Robocon & Robotics Workshop',
      category: 'Hands-On Robotics',
      date: '28 Jul 2026',
      role: 'Hardware & Sensor Testing Lead',
      award: 'Certified Participant (Grade A)',
      certificate: {
        certId: `CERT-ROBO-2026-${idNum}8B`,
        title: 'Certificate of Technical Mastery in Embedded Robotics',
        issuer: 'Robotics & Automation Society',
        date: '30 Jul 2026',
        recipient: student.name,
        rollNo: student.rollNo,
        dept: student.dept,
        seal: 'IEEE_STUDENT_BRANCH_SEAL',
        hash: `0x${student.rollNo?.toLowerCase() || 'stu'}robo7741d2e5`
      }
    }
  ];

  // 6. Pillar 6: Mentor Observations & Session Logs
  const mentorLogs = [
    {
      sessionNo: 1,
      date: '02 Aug 2026',
      mentorName: subjects[0]?.faculty || 'Prof. Ananya Roy',
      engagementScore: Math.min(95, Math.max(45, Math.round(55 + (idNum % 40)))),
      remarks: (baseCgpa < 5.0)
        ? 'Student shows conceptual gaps in foundational logic. Recommended daily 45-min peer tutoring sessions.'
        : 'Attentive in discussion. Recommended exploring advanced algorithmic complexity problems.',
      actionItem: 'Assign remedial problem sheet for Week 1 review.'
    },
    {
      sessionNo: 2,
      date: '10 Aug 2026',
      mentorName: subjects[0]?.faculty || 'Prof. Ananya Roy',
      engagementScore: Math.min(98, Math.max(50, Math.round(62 + (idNum % 35)))),
      remarks: 'Improved response in problem analysis. Completed 3 practice questions.',
      actionItem: 'Review mid-term assessment performance.'
    }
  ];

  // 7. Pillar 7: Socio-Economic Context & Welfare Support
  const incomeBrackets = ['< ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', '> ₹5,00,000'];
  const income = student.income || incomeBrackets[idNum % incomeBrackets.length];
  const commuteTypes = ['Hosteler (On-Campus Residence)', 'Day Scholar (18km daily rural transit)', 'Day Scholar (5km city commute)'];
  const commute = commuteTypes[idNum % commuteTypes.length];
  const deviceTypes = ['Personal Laptop & Broadband', 'Shared Family Smartphone (Limited 4G)', 'College Computer Lab Dependent'];
  const device = deviceTypes[idNum % deviceTypes.length];
  const financialAid = income.includes('<') || income.includes('1,00,000 - 2,00,000')
    ? 'Eligible for State Post-Matric Tuition Fee Waiver & Book Bank Textbooks'
    : 'Standard Fee Category (Not on Welfare Grant)';

  // ========================================================
  // REAL MULTI-FACTOR AI RISK SYNTHESIS ENGINE
  // ========================================================
  // 1. Attendance Weight (25%)
  const attScore = baseAtt < 50 ? 95 : baseAtt < 65 ? 80 : baseAtt < 75 ? 55 : baseAtt < 85 ? 20 : 5;

  // 2. Academic CGPA Weight (25%)
  let acadScore = 0;
  if (baseCgpa < 4.0) acadScore = 95;
  else if (baseCgpa < 5.0) acadScore = 75;
  else if (baseCgpa < 6.0) acadScore = 45;
  else if (baseCgpa < 7.5) acadScore = 20;
  else acadScore = 5;

  // 3. Assignment Submission Weight (15%)
  const onTimeCount = assignments.filter((a) => a.status === 'On-Time').length;
  const assignScore = onTimeCount === 3 ? 10 : onTimeCount === 2 ? 45 : 85;

  // 4. Backlogs Weight (15%)
  const backlogScore = Math.min(100, backlogsCount * 32);

  // 5. Co-Curricular Engagement Weight (5%)
  const coCurrScore = activities.length >= 2 ? 10 : 40;

  // 6. Mentor Score Weight (5%)
  const avgMentorScore = Math.round(mentorLogs.reduce((acc, m) => acc + m.engagementScore, 0) / mentorLogs.length);
  const mentorRiskScore = (100 - avgMentorScore);

  // 7. Socio-Economic Weight (10%)
  const socioScore = income.includes('<') ? 65 : income.includes('1,00,000') ? 40 : 15;

  // Synthesize Total Probability
  const totalProbability = Math.min(98, Math.max(8, Math.round(
    attScore * 0.25 +
    acadScore * 0.25 +
    assignScore * 0.15 +
    backlogScore * 0.15 +
    coCurrScore * 0.05 +
    mentorRiskScore * 0.05 +
    socioScore * 0.10
  )));

  let riskLevel = 'Low';
  if (totalProbability >= 65 || baseCgpa < 4.2 || backlogsCount >= 3 || baseAtt < 50) {
    riskLevel = 'High';
  } else if (totalProbability >= 40 || baseCgpa < 5.5 || backlogsCount > 0 || baseAtt < 75) {
    riskLevel = 'Medium';
  }

  // Exact Identified Risk Triggers
  const riskTriggers = [];
  if (baseAtt < 75) {
    riskTriggers.push(`Attendance below mandatory threshold: ${baseAtt}% (Safety Target: ≥75%)`);
  }
  if (baseCgpa < 5.0) {
    riskTriggers.push(`Sub-threshold cumulative GPA: ${baseCgpa} / 10 in core departmental subjects`);
  }
  if (backlogsCount > 0) {
    riskTriggers.push(`${backlogsCount} Active Backlog(s) pending supplementary clearance`);
  }
  if (onTimeCount < 3) {
    riskTriggers.push(`Incomplete / late assignment submissions flagged in mid-term evaluation`);
  }
  if (commute.includes('rural')) {
    riskTriggers.push(`Transit constraint: Daily ${commute} impacting morning lecture consistency`);
  }
  if (income.includes('<')) {
    riskTriggers.push(`Financial constraint requiring Book Bank textbook allocation & fee waiver`);
  }
  if (riskTriggers.length === 0) {
    riskTriggers.push('Student is performing consistently across all 7 evaluation pillars with zero backlog alerts.');
  }

  // AI Suggested Interventions
  const suggestedInterventions = [];
  if (backlogsCount > 0 || baseCgpa < 5.5) {
    suggestedInterventions.push(`Enroll in ${subjects[0]?.name || 'Departmental'} Remedial Problem-Solving Clinic`);
    suggestedInterventions.push('Assign peer tutor from final-year merit batch for practical lab coaching');
  }
  if (baseAtt < 75) {
    suggestedInterventions.push('Initiate 3-week biometric attendance recovery sprint with faculty mentor signature');
    suggestedInterventions.push('Send automated performance and attendance update notice to parents via WhatsApp');
  }
  if (income.includes('<') || device.includes('Lab Dependent')) {
    suggestedInterventions.push('Grant after-hours campus computing lab access and Book Bank textbook set');
  }
  if (suggestedInterventions.length === 0) {
    suggestedInterventions.push('Schedule bi-weekly mentorship check-in and recommend advanced honors electives.');
  }

  return {
    studentId: student.id,
    rollNo: student.rollNo,
    name: student.name,
    avatar: student.avatar,
    dept: student.dept,
    semester: sem,
    section: student.section,
    style: student.style || 'Visual Learner',
    // 7 Pillars
    subjectAttendance,
    semesterProgression,
    assignments,
    backlogsHistory,
    activities,
    mentorLogs,
    socioEconomic: {
      income,
      commute,
      device,
      financialAid
    },
    // AI Synthesis Output
    aiSynthesis: {
      dropoutProbability: `${totalProbability}%`,
      probabilityNum: totalProbability,
      riskLevel,
      riskTriggers,
      suggestedInterventions,
      weightsBreakdown: {
        attScore,
        acadScore,
        assignScore,
        backlogScore,
        socioScore,
        mentorRiskScore
      }
    }
  };
};
