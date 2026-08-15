const supabase = require('../config/database');

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function parseDate(dateStr = '15 Aug 2026') {
  const parts = dateStr.trim().split(' ');

  const day = parseInt(parts[0], 10) || 15;
  const monthStr = parts[1] || 'Aug';
  const year = parseInt(parts[2], 10) || 2026;

  const monthIndex = MONTH_SHORT.indexOf(monthStr);

  const month = monthIndex >= 0 ? monthIndex : 7;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthStart =
    `${year}-${String(month + 1).padStart(2, '0')}-01`;

  const monthEnd =
    `${year}-${String(month + 1).padStart(2, '0')}-${daysInMonth}`;

  const isoDate =
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    day,
    month,
    monthStr,
    year,
    daysInMonth,
    monthStart,
    monthEnd,
    isoDate,
    monthKey: `${monthStr} ${year}`
  };
}


/* =========================================================
   GET ATTENDANCE RECORDS
========================================================= */

exports.getAttendanceRecords = async ({
  date = '15 Aug 2026',
  department,
  semester,
  subject,
  section,
  search,
  page = 1,
  limit = 10
}) => {

  const {
    monthStart,
    monthEnd,
    isoDate,
    daysInMonth
  } = parseDate(date);


  // -----------------------------------------
  // Get students from Supabase
  // -----------------------------------------

  let studentQuery = supabase
    .from('students')
    .select('*')
    .order('roll_no', { ascending: true });

  if (
    department &&
    department !== 'All Departments'
  ) {
    studentQuery = studentQuery.eq(
      'department',
      department
    );
  }

  if (
    semester &&
    semester !== 'All Semesters'
  ) {
    const sem = parseInt(
      String(semester).replace('Semester ', ''),
      10
    );

    if (!Number.isNaN(sem)) {
      studentQuery = studentQuery.eq(
        'semester',
        sem
      );
    }
  }

  const {
    data: students,
    error: studentsError
  } = await studentQuery;

  if (studentsError) {
    throw studentsError;
  }


  // -----------------------------------------
  // Get attendance for current month
  // -----------------------------------------

  const {
    data: attendance,
    error: attendanceError
  } = await supabase
    .from('attendance')
    .select('*')
    .gte('attendance_date', monthStart)
    .lte('attendance_date', monthEnd);

  if (attendanceError) {
    throw attendanceError;
  }


  // -----------------------------------------
  // Create attendance map
  // -----------------------------------------

  const attendanceMap = {};

  for (const record of attendance || []) {

    if (!attendanceMap[record.student_id]) {
      attendanceMap[record.student_id] = [];
    }

    attendanceMap[record.student_id].push(record);
  }


  // -----------------------------------------
  // Build frontend records
  // -----------------------------------------

  let records = students.map((student) => {

    const studentAttendance =
      attendanceMap[student.id] || [];

    let attendedDays = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let leaveCount = 0;

    const attendanceHistory = {};

    for (const record of studentAttendance) {

      const status = record.status;

      const dateObject =
        new Date(`${record.attendance_date}T00:00:00`);

      const formattedDate =
        `${dateObject.getDate()} ${MONTH_SHORT[dateObject.getMonth()]} ${dateObject.getFullYear()}`;

      attendanceHistory[formattedDate] = status;

      if (status === 'Present') {
        attendedDays += 1;
        presentCount++;
      }

      else if (status === 'Late') {
        attendedDays += 0.5;
        lateCount++;
      }

      else if (status === 'Absent') {
        absentCount++;
      }

      else if (status === 'Leave') {
        leaveCount++;
      }
    }


    // Same calculation logic as your old system:
    // attendance / total days of month

    const attendancePct =
      daysInMonth > 0
        ? Number(
            ((attendedDays / daysInMonth) * 100)
              .toFixed(1)
          )
        : 0;


    // Status for selected day

    const selectedRecord =
      studentAttendance.find(
        (r) => r.attendance_date === isoDate
      );

    const dailyStatus =
      selectedRecord?.status || 'Not Marked';


    let finalRecords = {
      id: student.id,

      rollNo:
        student.roll_no || student.id,

      name:
        student.name,

      avatar:
        student.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`,

      initials:
        student.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),

      dept:
        student.department,

      semester:
        student.semester,

      subject:
        subject && subject !== 'All Subjects'
          ? subject
          : studentAttendance[0]?.subject ||
            'Data Structures',

      section:
        student.section || 'Section A',

      status:
        dailyStatus,

      attendancePct,

      attendedDays,

      markedDaysCount:
        studentAttendance.length,

      daysInMonth,

      presentCount,

      absentCount,

      lateCount,

      leaveCount,

      lastUpdated:
        date,

      attendanceHistory
    };

    return finalRecords;
  });


  // -----------------------------------------
  // Subject filter
  // -----------------------------------------

  if (
    subject &&
    subject !== 'All Subjects'
  ) {
    records = records.filter(
      (r) => r.subject === subject
    );
  }


  // -----------------------------------------
  // Section filter
  // -----------------------------------------

  if (
    section &&
    section !== 'All Sections'
  ) {
    records = records.filter(
      (r) => r.section === section
    );
  }


  // -----------------------------------------
  // Search
  // -----------------------------------------

  if (search) {

    const q =
      search.toLowerCase();

    records = records.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.rollNo.toLowerCase().includes(q) ||
      r.dept.toLowerCase().includes(q)
    );
  }


  // -----------------------------------------
  // Pagination
  // -----------------------------------------

  const total =
    records.length;

  const parsedLimit =
    limit === 'all'
      ? total
      : parseInt(limit, 10) || 10;

  const currentPage =
    parseInt(page, 10) || 1;

  const start =
    (currentPage - 1) * parsedLimit;

  const paginated =
    limit === 'all'
      ? records
      : records.slice(
          start,
          start + parsedLimit
        );


  return {
    success: true,

    total,

    count:
      paginated.length,

    page:
      currentPage,

    totalPages:
      limit === 'all'
        ? 1
        : Math.ceil(
            total / parsedLimit
          ),

    data:
      paginated
  };
};


/* =========================================================
   MARK ATTENDANCE
========================================================= */

exports.markAttendance = async ({
  studentId,
  rollNo,
  status,
  date = '15 Aug 2026',
  subject
}) => {

  const {
    isoDate
  } = parseDate(date);


  // Find student

  let studentQuery =
    supabase
      .from('students')
      .select('*')
      .limit(1);


  if (studentId) {
    studentQuery =
      studentQuery.eq(
        'id',
        studentId
      );
  }

  else if (rollNo) {
    studentQuery =
      studentQuery.eq(
        'roll_no',
        rollNo
      );
  }

  else {
    throw new Error(
      'studentId or rollNo is required'
    );
  }


  const {
    data: students,
    error: studentError
  } = await studentQuery;


  if (studentError) {
    throw studentError;
  }

  if (!students || students.length === 0) {
    throw new Error(
      'Student not found'
    );
  }


  const student =
    students[0];


  const finalStatus =
    status || 'Present';


  // Insert / update attendance

  const {
    data,
    error
  } = await supabase
    .from('attendance')
    .upsert(
      {
        student_id:
          student.id,

        attendance_date:
          isoDate,

        subject:
          subject || 'Data Structures',

        status:
          finalStatus
      },
      {
        onConflict:
          'student_id,attendance_date,subject'
      }
    )
    .select()
    .single();


  if (error) {
    throw error;
  }


  return {
    success: true,

    message:
      `Attendance marked as "${finalStatus}" for ${student.name}.`,

    data
  };
};


/* =========================================================
   GET ATTENDANCE STATS
========================================================= */

exports.getAttendanceStats = async ({
  date = '15 Aug 2026'
}) => {

  const {
    monthStart,
    monthEnd,
    daysInMonth,
    isoDate,
    monthKey
  } = parseDate(date);


  const {
    data: students,
    error: studentError
  } = await supabase
    .from('students')
    .select('*');


  if (studentError) {
    throw studentError;
  }


  const {
    data: attendance,
    error: attendanceError
  } = await supabase
    .from('attendance')
    .select('*')
    .gte(
      'attendance_date',
      monthStart
    )
    .lte(
      'attendance_date',
      monthEnd
    );


  if (attendanceError) {
    throw attendanceError;
  }


  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  let totalLeave = 0;
  let totalPercentage = 0;


  const studentCount =
    students.length;


  for (const student of students) {

    const records =
      (attendance || []).filter(
        (a) =>
          a.student_id === student.id
      );


    let attended = 0;


    for (const record of records) {

      if (record.status === 'Present') {
        attended++;
        totalPresent++;
      }

      else if (record.status === 'Late') {
        attended += 0.5;
        totalLate++;
      }

      else if (record.status === 'Absent') {
        totalAbsent++;
      }

      else if (record.status === 'Leave') {
        totalLeave++;
      }
    }


    const pct =
      daysInMonth > 0
        ? (attended / daysInMonth) * 100
        : 0;


    totalPercentage += pct;
  }


  const average =
    studentCount > 0
      ? totalPercentage / studentCount
      : 0;


  const selectedDayRecords =
    (attendance || []).filter(
      (a) =>
        a.attendance_date === isoDate
    );


  const notMarked =
    Math.max(
      0,
      studentCount -
      new Set(
        selectedDayRecords.map(
          (a) => a.student_id
        )
      ).size
    );


  return {
    success: true,

    data: {

      overall: {
        value:
          `${average.toFixed(1)}%`,

        change:
          `Month: ${monthKey} (${daysInMonth} days)`,

        totalStudents:
          studentCount,

        date,

        markedStudentsCount:
          new Set(
            selectedDayRecords.map(
              (a) => a.student_id
            )
          ).size
      },

      present: {
        value:
          totalPresent.toString(),

        percentage:
          studentCount > 0
            ? `${(
                totalPresent /
                studentCount *
                100
              ).toFixed(1)}%`
            : '0%'
      },

      absent: {
        value:
          totalAbsent.toString(),

        percentage:
          studentCount > 0
            ? `${(
                totalAbsent /
                studentCount *
                100
              ).toFixed(1)}%`
            : '0%'
      },

      late: {
        value:
          totalLate.toString(),

        percentage:
          studentCount > 0
            ? `${(
                totalLate /
                studentCount *
                100
              ).toFixed(1)}%`
            : '0%'
      },

      leave: {
        value:
          totalLeave.toString(),

        percentage:
          studentCount > 0
            ? `${(
                totalLeave /
                studentCount *
                100
              ).toFixed(1)}%`
            : '0%'
      },

      notMarked: {
        value:
          notMarked.toString()
      }
    }
  };
};