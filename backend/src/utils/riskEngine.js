// backend/src/utils/riskEngine.js
// Universal Risk Engine for EduSuccess AI ensuring 100% identical calculations everywhere

function evaluateStudentRisk(s) {
  let riskScore = 0;
  const factors = [];

  // 1. Attendance Factor (Weight: 35%)
  const attPct = typeof s.attendance?.percentage === 'number'
    ? s.attendance.percentage
    : parseFloat(s.attendance?.percentage || s.attendance) || 80;

  if (attPct < 60) {
    riskScore += 35;
    factors.push(`Low Attendance (${attPct}%)`);
  } else if (attPct < 75) {
    riskScore += 20;
    factors.push(`Attendance Below 75% (${attPct}%)`);
  }

  // 2. Academic Factor (Weight: 35%)
  const cgpaRaw = s.academic?.cgpa ?? s.cgpa;
  const cgpa = typeof cgpaRaw === 'number' ? cgpaRaw : parseFloat(cgpaRaw);
  if (!isNaN(cgpa)) {
    if (cgpa < 4.0) {
      riskScore += 35;
      factors.push(`Low CGPA (${cgpa})`);
    } else if (cgpa < 5.5) {
      riskScore += 20;
      factors.push(`CGPA Below 5.5 (${cgpa})`);
    }
  }

  // 3. Backlogs Factor (Weight: 15%)
  const backlogsRaw = s.backlogs ?? 0;
  const backlogs = typeof backlogsRaw === 'number' ? backlogsRaw : parseInt(backlogsRaw, 10);
  if (!isNaN(backlogs)) {
    if (backlogs >= 3) {
      riskScore += 15;
      factors.push(`${backlogs} Active Backlogs`);
    } else if (backlogs > 0) {
      riskScore += 8;
      factors.push(`${backlogs} Backlog(s)`);
    }
  }

  // 4. Learning Engagement Factor (Weight: 15%)
  const engagement = s.behavior?.engagement ?? 70;
  if (engagement < 50) {
    riskScore += 15;
    factors.push('Low Learning Engagement');
  } else if (engagement < 65) {
    riskScore += 8;
  }

  // Determine categorical level
  let level = 'Low';
  if (riskScore >= 60) level = 'High';
  else if (riskScore >= 30) level = 'Medium';

  return {
    score: `${riskScore}%`,
    scoreNum: riskScore,
    level,
    factors: factors.length > 0 ? factors.join(', ') : 'Stable'
  };
}

module.exports = {
  evaluateStudentRisk
};
