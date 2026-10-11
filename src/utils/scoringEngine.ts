import { StudentRecord, StudentSegment } from '../types/student';

export interface ScoreBreakdown {
  academicPillar: number; // max 30
  attendancePillar: number; // max 20
  lmsPillar: number; // max 15
  placementPillar: number; // max 25
  engagementPillar: number; // max 10
  totalScore: number; // 0 - 100
  positiveDrivers: { indicator: string; delta: number; detail: string }[];
  negativeDrivers: { indicator: string; delta: number; detail: string }[];
  status: 'Flourishing' | 'Steady' | 'Needs Monitoring' | 'Critical Risk';
  isAcademicRisk: boolean;
  isPlacementRisk: boolean;
  segment: StudentSegment;
}

export const COHORT_BASELINES = {
  cgpa: 7.3,
  examAvg: 74.0,
  attendance: 81.5,
  lmsCompletion: 76.0,
  lmsLogins: 4.5,
  codingScore: 64.0,
  aptitudeScore: 67.0,
  mockInterviewRating: 3.4,
  backlogs: 0.3,
};

export function computeSuccessScoreAndExplainability(
  input: Omit<StudentRecord, 'successScore' | 'status' | 'isAcademicRisk' | 'isPlacementRisk' | 'segment' | 'scoreAttribution'>
): ScoreBreakdown {
  // 1. Academic Pillar (Max 30 pts)
  const cgpaContribution = Math.min(18, (input.cgpa / 10) * 18);
  const examContribution = Math.min(12, (input.examAvg / 100) * 12);
  const backlogPenalty = input.backlogs * 8; // -8 pts per backlog
  const academicPillar = Math.max(0, Math.min(30, cgpaContribution + examContribution - backlogPenalty));

  // 2. Attendance Pillar (Max 20 pts)
  let attRate = input.attendance;
  let attPoints = 0;
  if (attRate >= 85) {
    attPoints = 16 + ((attRate - 85) / 15) * 4; // 16 to 20 pts
  } else if (attRate >= 75) {
    attPoints = 12 + ((attRate - 75) / 10) * 4; // 12 to 16 pts
  } else if (attRate >= 60) {
    attPoints = 6 + ((attRate - 60) / 15) * 6; // 6 to 12 pts
  } else {
    attPoints = Math.max(0, (attRate / 60) * 6);
  }

  if (input.attendanceTrend === 'improving') attPoints += 1.5;
  if (input.attendanceTrend === 'declining') attPoints -= 2.5;
  const attendancePillar = Math.max(0, Math.min(20, attPoints));

  // 3. LMS Engagement Pillar (Max 15 pts)
  const lmsCompletionPoints = (input.lmsCompletion / 100) * 9.5;
  const lmsLoginsPoints = Math.min(3.5, (input.lmsLogins / 7) * 3.5);
  const daysInactivePenalty = input.lmsDaysInactive > 5 ? Math.min(3, (input.lmsDaysInactive - 5) * 0.6) : 0;
  const lmsPillar = Math.max(0, Math.min(15, lmsCompletionPoints + lmsLoginsPoints - daysInactivePenalty));

  // 4. Placement & Skills Pillar (Max 25 pts)
  const codingPoints = (input.codingScore / 100) * 10;
  const aptitudePoints = (input.aptitudeScore / 100) * 7;
  const mockInterviewPoints = (input.mockInterviewRating / 5) * 5;
  const softSkillsPoints = (input.softSkillsScore / 100) * 3;
  const placementPillar = Math.max(0, Math.min(25, codingPoints + aptitudePoints + mockInterviewPoints + softSkillsPoints));

  // 5. Engagement & Feedback Pillar (Max 10 pts)
  const certsAndHackathons = Math.min(5, input.certificationsCount * 1.5 + input.hackathonsCount * 1.0);
  const facultyPoints = (input.facultyRating / 5) * 3;
  const satisfactionPoints = (input.studentSatisfaction / 5) * 2;
  const engagementPillar = Math.max(0, Math.min(10, certsAndHackathons + facultyPoints + satisfactionPoints));

  // Total Success Score
  const rawTotal = academicPillar + attendancePillar + lmsPillar + placementPillar + engagementPillar;
  const totalScore = Math.round(Math.max(5, Math.min(100, rawTotal)) * 10) / 10;

  // Status mapping
  let status: ScoreBreakdown['status'] = 'Steady';
  if (totalScore >= 80) status = 'Flourishing';
  else if (totalScore >= 65) status = 'Steady';
  else if (totalScore >= 50) status = 'Needs Monitoring';
  else status = 'Critical Risk';

  // Risk Identifications
  const isAcademicRisk = input.cgpa < 6.5 || input.backlogs > 0 || input.attendance < 75 || input.lmsCompletion < 60;
  const isPlacementRisk =
    input.codingScore < 55 || input.aptitudeScore < 55 || input.mockInterviewRating < 2.8 || input.resumeReadiness < 55;

  // Segmentation Engine
  let segment: StudentSegment = 'Steady Core Contributor';
  if (input.cgpa >= 7.5 && (input.codingScore < 60 || input.aptitudeScore < 55 || input.mockInterviewRating < 2.8)) {
    segment = 'High Academic, Low Placement';
  } else if (input.codingScore >= 75 && (input.cgpa < 6.5 || input.backlogs > 0 || input.attendance < 72)) {
    segment = 'Practical Prodigy, Academic Risk';
  } else if (input.cgpa < 6.0 && input.attendance < 72 && (input.backlogs >= 1 || input.codingScore < 50)) {
    segment = 'Multi-Risk Critical';
  } else if (
    (input.attendance < 72 || input.lmsDaysInactive >= 8 || input.attendanceTrend === 'declining') &&
    input.cgpa >= 6.0 &&
    input.backlogs === 0
  ) {
    segment = 'Disengaged Attrition Vector';
  } else if (input.cgpa >= 8.2 && input.codingScore >= 75 && input.attendance >= 82) {
    segment = 'Flourishing All-Rounder';
  } else {
    segment = 'Steady Core Contributor';
  }

  // Explainable Attribution (SHAP-inspired point contributions compared to baseline)
  const positiveDrivers: ScoreBreakdown['positiveDrivers'] = [];
  const negativeDrivers: ScoreBreakdown['negativeDrivers'] = [];

  // CGPA Driver
  const cgpaDelta = Math.round(((input.cgpa - COHORT_BASELINES.cgpa) / 10) * 18 * 10) / 10;
  if (cgpaDelta >= 1.5) {
    positiveDrivers.push({
      indicator: 'High Cumulative CGPA',
      delta: cgpaDelta,
      detail: `CGPA ${input.cgpa.toFixed(2)} exceeds cohort baseline of ${COHORT_BASELINES.cgpa}.`,
    });
  } else if (cgpaDelta <= -1.5) {
    negativeDrivers.push({
      indicator: 'Sub-Par CGPA',
      delta: cgpaDelta,
      detail: `CGPA ${input.cgpa.toFixed(2)} is lower than cohort average.`,
    });
  }

  // Backlogs Driver
  if (input.backlogs > 0) {
    negativeDrivers.push({
      indicator: 'Active Exam Backlogs',
      delta: -(input.backlogs * 8),
      detail: `${input.backlogs} unresolved backlog subject(s) incur statutory academic penalty.`,
    });
  }

  // Attendance Driver
  const attDelta = Math.round(((input.attendance - COHORT_BASELINES.attendance) / 20) * 4 * 10) / 10;
  if (input.attendance >= 88) {
    positiveDrivers.push({
      indicator: 'Punctual Class Attendance',
      delta: attDelta > 0 ? attDelta : 3.2,
      detail: `${input.attendance}% overall lecture & lab presence provides consistent momentum.`,
    });
  } else if (input.attendance < 75) {
    negativeDrivers.push({
      indicator: 'Statutory Attendance Deficit',
      delta: -6.5,
      detail: `${input.attendance}% is below the university mandatory 75% examination eligibility limit.`,
    });
  }

  // Coding & Placement Driver
  const codingDelta = Math.round(((input.codingScore - COHORT_BASELINES.codingScore) / 100) * 10 * 10) / 10;
  if (input.codingScore >= 75) {
    positiveDrivers.push({
      indicator: 'Strong Technical Coding Quotient',
      delta: codingDelta > 0 ? codingDelta : 3.8,
      detail: `${input.codingScore}% assessment score signals competitive programming readiness.`,
    });
  } else if (input.codingScore < 55) {
    negativeDrivers.push({
      indicator: 'Technical Assessment Vulnerability',
      delta: -4.5,
      detail: `Coding benchmark score of ${input.codingScore}% risks recruitment shortlisting failure.`,
    });
  }

  // LMS Completion Driver
  if (input.lmsCompletion >= 85) {
    positiveDrivers.push({
      indicator: 'Consistent LMS Submissions',
      delta: 2.5,
      detail: `${input.lmsCompletion}% assignment submission punctuality on course portal.`,
    });
  } else if (input.lmsCompletion < 60) {
    negativeDrivers.push({
      indicator: 'LMS Assignment Drop-off',
      delta: -3.8,
      detail: `Only ${input.lmsCompletion}% assignments submitted on time; indicates homework disengagement.`,
    });
  }

  // Inactivity Driver
  if (input.lmsDaysInactive >= 8) {
    negativeDrivers.push({
      indicator: 'Prolonged Portal Inactivity',
      delta: -2.4,
      detail: `Last logged into campus portal ${input.lmsDaysInactive} days ago.`,
    });
  }

  // Hackathons & Extracurriculars Driver
  if (input.hackathonsCount >= 2 || input.certificationsCount >= 3) {
    positiveDrivers.push({
      indicator: 'Demonstrated Co-Curricular Excellence',
      delta: 2.8,
      detail: `${input.certificationsCount} industry certifications & ${input.hackathonsCount} hackathons completed.`,
    });
  }

  // Mock Interview Driver
  if (input.mockInterviewRating >= 4.2) {
    positiveDrivers.push({
      indicator: 'Exceptional Interview Readiness',
      delta: 2.2,
      detail: `Panel evaluation score of ${input.mockInterviewRating}/5.0 indicates behavioral fluency.`,
    });
  } else if (input.mockInterviewRating < 2.8) {
    negativeDrivers.push({
      indicator: 'Mock Interview Performance Gap',
      delta: -3.0,
      detail: `Rated ${input.mockInterviewRating}/5.0 by panel; soft skills & technical articulation need remediation.`,
    });
  }

  return {
    academicPillar: Math.round(academicPillar * 10) / 10,
    attendancePillar: Math.round(attendancePillar * 10) / 10,
    lmsPillar: Math.round(lmsPillar * 10) / 10,
    placementPillar: Math.round(placementPillar * 10) / 10,
    engagementPillar: Math.round(engagementPillar * 10) / 10,
    totalScore,
    positiveDrivers,
    negativeDrivers,
    status,
    isAcademicRisk,
    isPlacementRisk,
    segment,
  };
}
