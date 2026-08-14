// backend/src/controllers/attendanceController.js
const { students } = require('../data/db');

exports.getAttendanceStats = (_req, res) => {
  const total = students.length;

  if (total === 0) {
    return res.status(200).json({
      success: true,
      data: {
        overall: { value: '0%', change: '0%', totalStudents: 0 },
        present: { value: '0', percentage: '0%' },
        absent: { value: '0', percentage: '0%' },
        late: { value: '0', percentage: '0%' },
        leave: { value: '0', percentage: '0%' },
        departments: []
      }
    });
  }

  const sumPct = students.reduce((acc, s) => {
    const pct = typeof s.attendance?.percentage === 'number' ? s.attendance.percentage : parseFloat(s.attendance?.percentage || s.attendance) || 80;
    return acc + pct;
  }, 0);

  const avgPct = (sumPct / total).toFixed(1);

  const presentList = students.filter((s) => s.attendance?.status === 'Present' || (s.attendance?.percentage ?? 80) >= 75);
  const absentList = students.filter((s) => s.attendance?.status === 'Absent' || (s.attendance?.percentage ?? 80) < 75);
  const presentCount = presentList.length;
  const absentCount = absentList.length;

  const presentPct = ((presentCount / total) * 100).toFixed(1);
  const absentPct = ((absentCount / total) * 100).toFixed(1);

  // Department-wise calculations
  const depts = ['Computer Engg.', 'Information Tech.', 'Electronics Engg.', 'Mechanical Engg.', 'Civil Engg.'];
  const departmentStats = depts.map((dName) => {
    const deptStudents = students.filter((s) => s.dept === dName);
    const count = deptStudents.length;
    if (count === 0) {
      return { department: dName, count: 0, percentage: '80.0%', present: 0, absent: 0 };
    }
    const dSum = deptStudents.reduce((acc, s) => acc + (s.attendance?.percentage ?? 80), 0);
    const dAvg = (dSum / count).toFixed(1);
    const dPres = deptStudents.filter((s) => s.attendance?.status === 'Present' || (s.attendance?.percentage ?? 80) >= 75).length;
    return {
      department: dName,
      count,
      percentage: `${dAvg}%`,
      present: dPres,
      absent: count - dPres
    };
  });

  res.status(200).json({
    success: true,
    data: {
      overall: {
        value: `${avgPct}%`,
        change: '+3.4% from last month',
        totalStudents: total
      },
      present: {
        value: presentCount.toString(),
        percentage: `${presentPct}%`
      },
      absent: {
        value: absentCount.toString(),
        percentage: `${absentPct}%`
      },
      late: {
        value: Math.max(0, Math.round(total * 0.05)).toString(),
        percentage: '5.0%'
      },
      leave: {
        value: '0',
        percentage: '0.0%'
      },
      departments: departmentStats
    }
  });
};

exports.getAttendanceRecords = (req, res) => {
  const { department, semester, subject, section, search, page, limit } = req.query;

  let records = students.map((s) => ({
    id: s.id,
    rollNo: s.rollNo || s.id, // Enrollment No
    name: s.name,
    avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: s.initials || s.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
    dept: s.dept,
    semester: s.semester,
    subject: s.attendance?.subject || 'Core Engineering',
    section: s.section || s.attendance?.section || 'Section A',
    status: s.attendance?.status || ((s.attendance?.percentage ?? 80) >= 75 ? 'Present' : 'Absent'),
    attendancePct: typeof s.attendance?.percentage === 'number' ? s.attendance.percentage : parseFloat(s.attendance?.percentage || s.attendance) || 80,
    lastUpdated: s.attendance?.lastUpdated || '13 May 2025'
  }));

  if (department && department !== 'All Departments') {
    records = records.filter((r) => r.dept === department);
  }

  if (semester && semester !== 'All Semesters') {
    const semNum = semester.replace('Semester ', '').trim();
    records = records.filter((r) => `${r.semester}` === semNum || `${r.semester}` === semester);
  }

  if (subject && subject !== 'All Subjects') {
    records = records.filter((r) => r.subject === subject);
  }

  if (section && section !== 'All Sections') {
    records = records.filter((r) => r.section === section);
  }

  if (search) {
    const q = search.toLowerCase();
    records = records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.dept.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q)
    );
  }

  const total = records.length;

  let paginated = records;
  if (limit && limit !== 'all') {
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    const startIndex = (p - 1) * l;
    paginated = records.slice(startIndex, startIndex + l);
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

exports.markAttendance = (req, res) => {
  const { studentId, rollNo, status, date, subject, remark } = req.body;

  const student = students.find((s) => s.id === studentId || s.rollNo === rollNo);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  if (!student.attendance) {
    student.attendance = {};
  }

  student.attendance.status = status || 'Present';
  student.attendance.lastUpdated = date || new Date().toLocaleDateString('en-GB');
  if (subject) student.attendance.subject = subject;

  // Adjust attendance % dynamically on mark
  if (status === 'Present' && student.attendance.percentage < 95) {
    student.attendance.percentage = Math.min(100, student.attendance.percentage + 2);
  } else if (status === 'Absent' && student.attendance.percentage > 20) {
    student.attendance.percentage = Math.max(10, student.attendance.percentage - 3);
  }

  res.status(200).json({
    success: true,
    message: `Attendance marked as ${status} for ${student.name} (${student.rollNo || student.id})`,
    data: student
  });
};

exports.bulkUploadAttendance = (req, res) => {
  const records = req.body.records || req.body || [];
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ success: false, message: 'No records provided' });
  }

  let updatedCount = 0;

  records.forEach((row) => {
    const id = row.id || row['Student ID'] || row['ID'];
    const rollNo = row.rollNo || row['Roll No.'] || row['Roll No'] || row['Enrollment No'];
    const student = students.find((s) => s.id === id || s.rollNo === rollNo || s.name === row.name);

    if (student) {
      const attPctRaw = row.attendance ?? row['Attendance'] ?? row.attendancePct;
      if (attPctRaw !== undefined && attPctRaw !== '-') {
        student.attendance.percentage = typeof attPctRaw === 'number' ? attPctRaw : parseFloat(String(attPctRaw).replace('%', '')) || student.attendance.percentage;
      }
      const statusRaw = row.status ?? row['Status'];
      if (statusRaw && statusRaw !== '-') {
        student.attendance.status = statusRaw;
      }
      updatedCount++;
    }
  });

  res.status(200).json({
    success: true,
    message: `Attendance updated for ${updatedCount} students.`,
    updatedCount
  });
};

exports.takeAction = (req, res) => {
  const { actionType, studentIds, note } = req.body;
  res.status(200).json({
    success: true,
    message: `Action "${actionType || 'Parent Notice'}" successfully triggered for ${studentIds?.length || 0} student(s).`,
    timestamp: new Date().toISOString()
  });
};
