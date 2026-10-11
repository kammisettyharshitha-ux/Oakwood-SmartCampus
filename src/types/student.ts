export type RiskLevel = 'Low' | 'Medium' | 'Critical';

export type StudentSegment =
  | 'High Academic, Low Placement'
  | 'Practical Prodigy, Academic Risk'
  | 'Disengaged Attrition Vector'
  | 'Multi-Risk Critical'
  | 'Flourishing All-Rounder'
  | 'Steady Core Contributor';

export interface SubjectGrade {
  code: string;
  name: string;
  marks: number;
  grade: string;
  attendance: number;
  credits: number;
}

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: 'Computer Science' | 'Data Science' | 'AI & ML' | 'Electronics & Comm' | 'Information Tech' | 'Mechanical';
  semester: number;
  avatarUrl?: string;

  // 1. Academic Data
  cgpa: number; // 0 - 10
  backlogs: number; // count
  examAvg: number; // 0 - 100%
  subjectPerformance: SubjectGrade[];

  // 2. Attendance Data
  attendance: number; // Overall %
  theoryAttendance: number; // %
  labAttendance: number; // %
  attendanceTrend: 'improving' | 'stable' | 'declining';

  // 3. LMS Activity Data
  lmsLogins: number; // logins per week
  lmsCompletion: number; // assignment completion %
  lmsDaysInactive: number; // days since last activity
  lmsForumPosts: number;

  // 4. Engagement & Extracurricular Data
  hackathonsCount: number;
  clubRole: string; // e.g. 'ACM Lead', 'Robotics Member', 'None'
  certificationsCount: number;
  collegeEventsAttended: number;

  // 5. Placement Data
  aptitudeScore: number; // 0 - 100
  codingScore: number; // 0 - 100
  mockInterviewRating: number; // 1.0 - 5.0
  resumeReadiness: number; // 0 - 100%

  // 6. Skills Assessments
  technicalSkillsScore: number; // 0 - 100
  softSkillsScore: number; // 0 - 100
  problemSolvingIndex: number; // 0 - 100

  // 7. Feedback & Wellbeing
  studentSatisfaction: number; // 1 - 5
  facultyRating: number; // 1 - 5
  facultyFeedbackSentiment: 'positive' | 'neutral' | 'concerning';
  mentorNote: string;

  // Computed Analytical Outputs
  successScore: number; // 0 - 100
  status: 'Flourishing' | 'Steady' | 'Needs Monitoring' | 'Critical Risk';
  isAcademicRisk: boolean;
  isPlacementRisk: boolean;
  segment: StudentSegment;
  
  // Explainable Indicator Attribution (SHAP-inspired point contributions)
  scoreAttribution: {
    positiveDrivers: { indicator: string; delta: number; detail: string }[];
    negativeDrivers: { indicator: string; delta: number; detail: string }[];
    academicContribution: number;
    attendanceContribution: number;
    placementContribution: number;
    engagementContribution: number;
    feedbackContribution: number;
  };
}

export interface InterventionItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  category: 'Academic Tutoring' | 'Placement Bootcamp' | 'Attendance Counseling' | 'Mental Health & Mentor' | 'Coding Drill';
  priority: 'Immediate' | 'High' | 'Normal';
  assignedTo: string;
  targetMetric: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Resolved';
  actionNote: string;
  createdAt: string;
}

export interface CohortAnalyticsSummary {
  totalStudents: number;
  avgSuccessScore: number;
  avgCgpa: number;
  avgAttendance: number;
  avgLmsCompletion: number;
  avgCodingScore: number;
  avgAptitudeScore: number;
  academicRiskCount: number;
  placementRiskCount: number;
  dualRiskCount: number;
  flourishingCount: number;
  segmentDistribution: Record<StudentSegment, number>;
  departmentBreakdown: Record<string, { total: number; avgScore: number; atRisk: number }>;
}
