// backend/src/controllers/attendanceController.js - Month-Wise Realistic Attendance System
const { students } = require('../data/db');

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

// Calculate real student percentage based strictly on their monthly attendance out of total days in that month
const calculateStudentMonthlyAttendance = (student, targetDateStr = '15 Aug 2026') => {
  const { monthKey, daysInMonth } = parseDateParams(targetDateStr);
  const historyEntries = Object.entries(student.attendanceHistory || {}).filter(
    ([dKey, st]) => dKey.includes(monthKey) && st && st !== 'Not Marked' && st !== '-'
  );

  let attended = 0;
  let pCount = 0, aCount = 0, lCount = 0, lvCount = 0;

  historyEntries.forEach(([_, st]) => {
    if (st === 'Present') {
      attended += 1;
      pCount++;
    } else if (st === 'Late') {
      attended += 0.5;
      lCount++;
    } else if (st === 'Absent') {
      aCount++;
    } else if (st === 'Leave') {
      lvCount++;
    }
  });

  // Calculate percentage out of total days in the month (e.g. 31 in Aug)
  const pct = daysInMonth > 0 ? parseFloat(((attended / daysInMonth) * 100).toFixed(1)) : 0;

  return {
    pct,
    attendedDays: attended,
    markedCount: historyEntries.length,
    daysInMonth,
    presentCount: pCount,
    absentCount: aCount,
    lateCount: lCount,
    leaveCount: lvCount
  };
};

exports.getAttendanceStats = (req, res) => {
  const targetDate = req.query.date || '15 Aug 2026';
  const { monthKey, daysInMonth } = parseDateParams(targetDate);
  const total = students.length;

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;
  let notMarkedCount = 0;

  let sumPct = 0;
  let markedStudentsCount = 0;

  students.forEach((s) => {
    const dayStatus = s.attendanceHistory?.[targetDate] || 'Not Marked';
    const stats = calculateStudentMonthlyAttendance(s, targetDate);

    if (stats.markedCount > 0) {
      markedStudentsCount++;
    }
    sumPct += stats.pct;

    if (dayStatus === 'Present') presentCount++;
    else if (dayStatus === 'Absent') absentCount++;
    else if (dayStatus === 'Late') lateCount++;
    else if (dayStatus === 'Leave') leaveCount++;
    else notMarkedCount++;
  });

  const avgPct = total > 0 ? (sumPct / total).toFixed(1) : '0.0';
  const presentPct = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';
  const absentPct = total > 0 ? ((absentCount / total) * 100).toFixed(1) : '0.0';
  const latePct = total > 0 ? ((lateCount / total) * 100).toFixed(1) : '0.0';
  const leavePct = total > 0 ? ((leaveCount / total) * 100).toFixed(1) : '0.0';

  // Department-wise stats for marked records
  const depts = ['Computer Engg.', 'Information Tech.', 'Electronics Engg.', 'Mechanical Engg.', 'Civil Engg.'];
  const departmentStats = depts.map((dName) => {
    const deptStudents = students.filter((s) => s.dept === dName);
    const count = deptStudents.length;
    if (count === 0) {
      return { department: dName, count: 0, percentage: '0.0%', present: 0, absent: 0 };
    }
    const dSum = deptStudents.reduce((acc, s) => acc + calculateStudentMonthlyAttendance(s, targetDate).pct, 0);
    const dAvg = (dSum / count).toFixed(1);
    const dPres = deptStudents.filter((s) => (s.attendanceHistory?.[targetDate] || '') === 'Present').length;
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
        change: `Month: ${monthKey} (${daysInMonth} days)`,
        totalStudents: total,
        date: targetDate,
        markedStudentsCount
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
        value: lateCount.toString(),
        percentage: `${latePct}%`
      },
      leave: {
        value: leaveCount.toString(),
        percentage: `${leavePct}%`
      },
      notMarked: {
        value: notMarkedCount.toString()
      },
      departments: departmentStats
    }
  });
};

exports.getAttendanceRecords = (req, res) => {
  const { date = '15 Aug 2026', department, semester, subject, section, search, page, limit } = req.query;

  let records = students.map((s) => {
    const dailyStatus = s.attendanceHistory?.[date] || 'Not Marked';
    const stats = calculateStudentMonthlyAttendance(s, date);

    return {
      id: s.id,
      rollNo: s.rollNo || s.id,
      name: s.name,
      avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: s.initials || s.name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      dept: s.dept,
      semester: s.semester,
      subject: s.attendance?.subject || 'Data Structures',
      section: s.section || s.attendance?.section || 'Section A',
      status: dailyStatus,
      attendancePct: stats.pct,
      attendedDays: stats.attendedDays,
      markedDaysCount: stats.markedCount,
      daysInMonth: stats.daysInMonth,
      lastUpdated: date,
      attendanceHistory: s.attendanceHistory || {}
    };
  });

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
        r.dept.toLowerCase().includes(q)
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
  const { studentId, rollNo, status, date = '15 Aug 2026', subject, remark } = req.body;

  const student = students.find((s) => s.id === studentId || s.rollNo === rollNo || s.id === rollNo);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  if (!student.attendanceHistory) {
    student.attendanceHistory = {};
  }

  // Idempotent manual store
  student.attendanceHistory[date] = status || 'Present';

  if (!student.attendance) {
    student.attendance = {};
  }
  student.attendance.status = status || 'Present';
  student.attendance.lastUpdated = date;
  if (subject) student.attendance.subject = subject;

  // Real recalculated monthly percentage
  const stats = calculateStudentMonthlyAttendance(student, date);
  student.attendance.percentage = stats.pct;

  res.status(200).json({
    success: true,
    message: `Attendance marked as "${status}" on ${date} for ${student.name} (${student.rollNo || student.id}). Monthly Attendance: ${stats.pct}% (${stats.attendedDays}/${stats.daysInMonth} days).`,
    data: {
      ...student,
      attendancePct: stats.pct,
      attendedDays: stats.attendedDays,
      daysInMonth: stats.daysInMonth,
      status: status || 'Present',
      date
    }
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
      const targetDate = row.date || row['Date'] || '15 Aug 2026';
      const statusRaw = row.status ?? row['Status'];
      if (statusRaw && statusRaw !== '-' && statusRaw !== 'Not Marked') {
        if (!student.attendanceHistory) student.attendanceHistory = {};
        student.attendanceHistory[targetDate] = statusRaw;
        student.attendance.status = statusRaw;
        const stats = calculateStudentMonthlyAttendance(student, targetDate);
        student.attendance.percentage = stats.pct;
        updatedCount++;
      }
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
