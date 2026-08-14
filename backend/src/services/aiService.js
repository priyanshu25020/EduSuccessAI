// backend/src/services/aiService.js
// Supports Gemini API / OpenAI API via API keys configured in .env

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Predicts risk factors and generates actionable intervention strategy
 */
exports.predictStudentRisk = async (studentData) => {
  const { name = 'Student', attendancePct = 75, cgpa = 7.0, backlogs = 0, studyTime = '2h', riskLevel = 'Low' } = studentData;

  // If Gemini API key is provided, we can call Google Gemini endpoint
  if (GEMINI_API_KEY) {
    try {
      const prompt = `Analyze this student's risk profile and suggest 3 concrete intervention steps in JSON format: Name: ${name}, Attendance: ${attendancePct}%, CGPA: ${cgpa}, Backlogs: ${backlogs}, Daily Study Time: ${studyTime}, Current Risk: ${riskLevel}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );
      const data = await response.json();
      const generatedText = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] ? data.candidates[0].content.parts[0].text : null;
      if (generatedText) {
        return {
          aiGenerated: true,
          provider: 'Gemini 1.5 Flash',
          insight: generatedText
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent heuristic fallback:', err.message);
    }
  }

  // Fallback heuristic recommendations
  const recommendations = [];
  if (attendancePct < 75) {
    recommendations.push('Attendance is below threshold (75%). Schedule mandatory counseling session and send automated alert to parents.');
  }
  if (cgpa < 5.0 || backlogs > 0) {
    recommendations.push(`Identified ${backlogs} backlogs with ${cgpa} CGPA. Assign a peer tutor for remedial subject coaching.`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Student performance is stable. Continue monitoring weekly engagement.');
  }

  return {
    aiGenerated: false,
    provider: 'EduSuccess Predictive Engine',
    apiKeyConfigured: Boolean(GEMINI_API_KEY || OPENAI_API_KEY),
    riskScore: `${Math.min(95, Math.round(100 - (attendancePct * 0.4 + cgpa * 6)))}%`,
    recommendations
  };
};

/**
 * Generates warning letters or personalized intervention drafts
 */
exports.generateInterventionDraft = async (studentData, type = 'letter') => {
  const { name = 'Student', id = 'STU0000', dept = 'Engineering', attendancePct = 75, cgpa = 7.0 } = studentData || {};

  return {
    title: `Academic & Attendance Notice - ${name} (${id})`,
    subject: `Urgent: Academic Performance and Attendance Review - ${dept}`,
    body: `Dear Parent/Guardian of ${name} (${id}),\n\nThis is to bring to your immediate attention that ${name}'s current attendance stands at ${attendancePct}% and CGPA is ${cgpa}.\n\nTo ensure academic success and timely completion of the semester, we request your presence for a mentor-parent review.\n\nWarm regards,\nAcademic Dean, EduSuccess Platform.`,
    type
  };
};
