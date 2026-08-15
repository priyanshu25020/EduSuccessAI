// backend/src/controllers/studentController.js
const { students } = require('../data/db');
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

exports.getAllStudents = (req, res) => {
  const { department, semester, riskLevel, status, search, page, limit, date = '15 Aug 2026' } = req.query;

  let list = students.map((s) => {
    const attStats = calculateStudentMonthlyAttendance(s, date);
    const updatedStudent = {
      ...s,
      attendance: {
        ...(s.attendance || {}),
        percentage: attStats.pct,
        attendedDays: attStats.attendedDays,
        daysInMonth: attStats.daysInMonth,
        status: s.attendanceHistory?.[date] || (s.attendance?.status || 'Not Marked'),
        lastUpdated: attStats.markedCount > 0 ? (s.attendanceHistory?.[date] ? date : (s.attendance?.lastUpdated || '-')) : '-'
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

  if (department && department !== 'All Departments') {
    list = list.filter((s) => s.dept === department);
  }

  if (semester && semester !== 'All Semesters') {
    const semNum = semester.replace('Semester ', '').trim();
    list = list.filter((s) => `${s.semester}` === semNum || `${s.semester}` === semester);
  }

  if (riskLevel && riskLevel !== 'All Risk Levels') {
    const target = riskLevel.replace(' Risk', '').toLowerCase();
    list = list.filter((s) => s.riskLevel.toLowerCase() === target || s.riskLevel.toLowerCase() === riskLevel.toLowerCase());
  }

  if (status && status !== 'All Status') {
    list = list.filter((s) => (s.status || 'Active').toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q) ||
        (s.rollNo || '').toLowerCase().includes(q) ||
        (s.dept || '').toLowerCase().includes(q)
    );
  }

  const total = list.length;

  // Only paginate if explicit limit is requested
  let paginated = list;
  if (limit && limit !== 'all') {
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 50;
    const startIndex = (p - 1) * l;
    paginated = list.slice(startIndex, startIndex + l);
  }

  res.status(200).json({
    success: true,
    total,
    count: paginated.length,
    page: parseInt(page, 10) || 1,
    totalPages: limit && limit !== 'all' ? Math.ceil(total / parseInt(limit, 10)) : 1,
    data: paginated
  });
};

exports.getStudentById = (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const targetDate = req.query.date || '15 Aug 2026';
  const attStats = calculateStudentMonthlyAttendance(student, targetDate);
  const updatedStudent = {
    ...student,
    attendance: {
      ...(student.attendance || {}),
      percentage: attStats.pct,
      attendedDays: attStats.attendedDays,
      daysInMonth: attStats.daysInMonth,
      status: student.attendanceHistory?.[targetDate] || (student.attendance?.status || 'Not Marked'),
      lastUpdated: attStats.markedCount > 0 ? (student.attendanceHistory?.[targetDate] ? targetDate : (student.attendance?.lastUpdated || '-')) : '-'
    }
  };

  const riskEval = evaluateStudentRisk(updatedStudent);

  res.status(200).json({
    success: true,
    data: {
      ...updatedStudent,
      calculatedRisk: riskEval,
      riskScore: riskEval.score,
      riskLevel: riskEval.level,
      factors: riskEval.factors
    }
  });
};

exports.createStudent = (req, res) => {
  const b = req.body || {};
  const newId = b.id || `STU${1001 + students.length}`;
  const name = (b.name && b.name.trim()) ? b.name.trim() : '-';
  const rollNo = (b.rollNo && b.rollNo.trim()) ? b.rollNo.trim() : '-';
  const dept = (b.dept && b.dept.trim()) ? b.dept.trim() : '-';
  const semester = b.semester !== undefined && b.semester !== '' ? b.semester : '-';
  const attendancePct = b.attendancePct !== undefined && b.attendancePct !== '' ? Number(b.attendancePct) : 80;
  const cgpa = b.cgpa !== undefined && b.cgpa !== '' ? (typeof b.cgpa === 'number' ? b.cgpa : parseFloat(b.cgpa) || '-') : '-';
  const backlogs = b.backlogs !== undefined && b.backlogs !== '' ? (typeof b.backlogs === 'number' ? b.backlogs : parseInt(b.backlogs, 10) || 0) : 0;
  const status = (b.status && b.status.trim()) ? b.status.trim() : 'Active';

  const newStudent = {
    id: newId,
    rollNo,
    name,
    avatar: b.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: name !== '-' ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'ST',
    dept,
    semester,
    cgpa,
    backlogs,
    status,
    attendance: {
      percentage: attendancePct,
      status: attendancePct >= 75 ? 'Present' : 'Absent',
      subject: b.subject || 'Core Engineering',
      section: b.section || 'Section A',
      lastUpdated: '13 May 2025'
    },
    academic: {
      cgpa,
      grade: typeof cgpa === 'number' ? (cgpa >= 8 ? 'A' : cgpa >= 6 ? 'B' : cgpa >= 4 ? 'C' : 'F') : '-',
      marks: typeof cgpa === 'number' ? Math.round(cgpa * 9.5) : 60,
      atRisk: typeof cgpa === 'number' ? cgpa < 5.0 : false
    },
    behavior: {
      studyTime: b.studyTime || '2h 30m',
      studyTimeHours: 2.5,
      consistency: b.consistency || 75,
      engagement: b.engagement || 70,
      style: b.style || 'Visual Learner',
      styleClass: 'visual',
      riskLevel: 'Low'
    },
    socioEconomic: {
      riskLevel: b.socioRisk || 'Low Risk',
      riskClass: 'green',
      income: b.income || '> ₹2,00,000',
      education: b.education || 'Graduate',
      location: b.location || 'Urban',
      firstGen: false,
      singleParent: false,
      resourceAccess: 80
    },
    risk: {
      score: '20%',
      level: 'Low',
      factors: 'None'
    }
  };

  const riskEval = evaluateStudentRisk(newStudent);
  newStudent.calculatedRisk = riskEval;
  newStudent.risk.score = riskEval.score;
  newStudent.risk.level = riskEval.level;
  newStudent.risk.factors = riskEval.factors;

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
};

exports.bulkCreateStudents = (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : req.body.students || [];

  if (!incoming.length) {
    return res.status(400).json({ success: false, message: 'No student records provided' });
  }

  const added = [];

  incoming.forEach((row, idx) => {
    const name = row.name || row['Student Name'] || row['Name'] || '-';
    const rollNo = row.rollNo || row['Roll No.'] || row['Roll No'] || row['Roll Number'] || '-';
    const dept = row.dept || row['Department'] || row['Branch'] || '-';
    const semRaw = row.semester ?? row['Semester'] ?? '-';
    const semVal = semRaw !== '-' && semRaw !== '' ? (typeof semRaw === 'string' ? parseInt(semRaw.replace('Semester ', ''), 10) || semRaw : semRaw) : '-';
    const attRaw = row.attendance ?? row['Attendance'] ?? row.attendancePct ?? 80;
    const attVal = typeof attRaw === 'string' ? parseFloat(attRaw.replace('%', '')) || 80 : Number(attRaw) || 80;
    const cgpaRaw = row.cgpa ?? row['CGPA'] ?? '-';
    const cgpaVal = cgpaRaw !== '-' && cgpaRaw !== '' ? (typeof cgpaRaw === 'string' ? parseFloat(cgpaRaw) || '-' : cgpaRaw) : '-';
    const backlogsRaw = row.backlogs ?? row['Backlogs'] ?? 0;
    const backlogsVal = typeof backlogsRaw === 'string' ? parseInt(backlogsRaw, 10) || 0 : Number(backlogsRaw) || 0;
    const status = row.status || row['Status'] || 'Active';
    const id = row.id || row['Student ID'] || row['ID'] || `STU${1001 + students.length}`;

    const newStudent = {
      id,
      rollNo,
      name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: name !== '-' ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'ST',
      dept,
      semester: semVal,
      cgpa: cgpaVal,
      backlogs: backlogsVal,
      status,
      attendance: {
        percentage: attVal,
        status: attVal >= 75 ? 'Present' : 'Absent',
        subject: row.subject || 'Core Engineering',
        section: row.section || 'Section A',
        lastUpdated: '13 May 2025'
      },
      academic: {
        cgpa: cgpaVal,
        grade: typeof cgpaVal === 'number' ? (cgpaVal >= 8 ? 'A' : cgpaVal >= 6 ? 'B' : cgpaVal >= 4 ? 'C' : 'F') : '-',
        marks: typeof cgpaVal === 'number' ? Math.round(cgpaVal * 9.5) : 60,
        atRisk: typeof cgpaVal === 'number' ? cgpaVal < 5.0 : false
      },
      behavior: {
        studyTime: '2h 30m',
        studyTimeHours: 2.5,
        consistency: 75,
        engagement: 70,
        style: 'Visual Learner',
        styleClass: 'visual',
        riskLevel: 'Low'
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
        score: '20%',
        level: 'Low',
        factors: 'None'
      }
    };

    const riskEval = evaluateStudentRisk(newStudent);
    newStudent.calculatedRisk = riskEval;
    newStudent.risk.score = riskEval.score;
    newStudent.risk.level = riskEval.level;
    newStudent.risk.factors = riskEval.factors;

    students.push(newStudent);
    added.push(newStudent);
  });

  res.status(201).json({
    success: true,
    message: `Successfully imported ${added.length} students from Excel.`,
    count: added.length,
    data: added
  });
};

exports.deleteStudent = (req, res) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const removed = students.splice(index, 1);
  res.status(200).json({
    success: true,
    message: `Student ${removed[0].name} (${removed[0].id}) deleted successfully.`
  });
};
