import React, { useState } from 'react';
import { StudentRecord } from '../types/student';
import { computeSuccessScoreAndExplainability } from '../utils/scoringEngine';
import { 
  X, 
  UserPlus, 
  BookOpen, 
  Calendar, 
  Laptop, 
  Briefcase, 
  Award, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sliders,
  ShieldAlert
} from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: StudentRecord) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  // 1. Basic Student Info
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<StudentRecord['department']>('Computer Science');
  const [semester, setSemester] = useState<number>(6);

  // 2. Academic Stream
  const [cgpa, setCgpa] = useState<number>(7.8);
  const [backlogs, setBacklogs] = useState<number>(0);
  const [examAvg, setExamAvg] = useState<number>(78);

  // 3. Attendance Stream
  const [attendance, setAttendance] = useState<number>(84);
  const [theoryAttendance, setTheoryAttendance] = useState<number>(85);
  const [labAttendance, setLabAttendance] = useState<number>(82);
  const [attendanceTrend, setAttendanceTrend] = useState<StudentRecord['attendanceTrend']>('stable');

  // 4. LMS Engagement Stream
  const [lmsLogins, setLmsLogins] = useState<number>(5);
  const [lmsCompletion, setLmsCompletion] = useState<number>(80);
  const [lmsDaysInactive, setLmsDaysInactive] = useState<number>(2);

  // 5. Placement & Industry Readiness Stream
  const [codingScore, setCodingScore] = useState<number>(68);
  const [aptitudeScore, setAptitudeScore] = useState<number>(72);
  const [mockInterviewRating, setMockInterviewRating] = useState<number>(3.5);
  const [resumeReadiness, setResumeReadiness] = useState<number>(75);

  // 6. Skills & Extracurricular Stream
  const [hackathonsCount, setHackathonsCount] = useState<number>(1);
  const [certificationsCount, setCertificationsCount] = useState<number>(1);
  const [clubRole, setClubRole] = useState<string>('Active Member');
  const [technicalSkillsScore, setTechnicalSkillsScore] = useState<number>(70);
  const [softSkillsScore, setSoftSkillsScore] = useState<number>(72);
  const [problemSolvingIndex, setProblemSolvingIndex] = useState<number>(70);

  // 7. Qualitative Faculty Feedback Stream
  const [facultyRating, setFacultyRating] = useState<number>(4.0);
  const [studentSatisfaction, setStudentSatisfaction] = useState<number>(4);
  const [mentorNote, setMentorNote] = useState<string>(
    'Student demonstrates steady participation in lectures and laboratory sessions.'
  );

  // Validation & Error
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate live preview score on the fly
  const livePreview = computeSuccessScoreAndExplainability({
    id: 'preview',
    rollNo: rollNo || '22CS000',
    name: name || 'Student Preview',
    email: email || 'student@oakwood.edu',
    department,
    semester,
    cgpa: Number(cgpa) || 7.0,
    backlogs: Number(backlogs) || 0,
    examAvg: Number(examAvg) || 75,
    attendance: Number(attendance) || 80,
    theoryAttendance: Number(theoryAttendance) || 80,
    labAttendance: Number(labAttendance) || 80,
    attendanceTrend,
    lmsCompletion: Number(lmsCompletion) || 75,
    lmsLogins: Number(lmsLogins) || 4,
    lmsDaysInactive: Number(lmsDaysInactive) || 2,
    aptitudeScore: Number(aptitudeScore) || 70,
    codingScore: Number(codingScore) || 70,
    mockInterviewRating: Number(mockInterviewRating) || 3.5,
    resumeReadiness: Number(resumeReadiness) || 75,
    hackathonsCount: Number(hackathonsCount) || 1,
    certificationsCount: Number(certificationsCount) || 1,
    technicalSkillsScore: Number(technicalSkillsScore) || 70,
    softSkillsScore: Number(softSkillsScore) || 70,
    problemSolvingIndex: Number(problemSolvingIndex) || 70,
    clubRole,
    facultyRating: Number(facultyRating) || 4.0,
    studentSatisfaction: Number(studentSatisfaction) || 4,
    lmsForumPosts: 4,
    collegeEventsAttended: 3,
    facultyFeedbackSentiment: (Number(facultyRating) >= 3.8 ? 'positive' : Number(facultyRating) >= 3.0 ? 'neutral' : 'concerning') as 'positive' | 'neutral' | 'concerning',
    mentorNote,
    subjectPerformance: [],
  });

  // Quick Preset Handlers for convenience
  const applyPreset = (presetType: 'flourishing' | 'atRisk' | 'placementGap' | 'practicalCoder') => {
    if (presetType === 'flourishing') {
      setName('Aarav Kapoor');
      setRollNo(`22CS${Math.floor(1000 + Math.random() * 900)}`);
      setEmail('aarav.k@oakwood.edu');
      setDepartment('Computer Science');
      setCgpa(9.2);
      setBacklogs(0);
      setExamAvg(92);
      setAttendance(95);
      setTheoryAttendance(96);
      setLabAttendance(94);
      setAttendanceTrend('improving');
      setLmsCompletion(98);
      setLmsLogins(8);
      setLmsDaysInactive(0);
      setCodingScore(90);
      setAptitudeScore(92);
      setMockInterviewRating(4.6);
      setResumeReadiness(95);
      setHackathonsCount(3);
      setCertificationsCount(4);
      setTechnicalSkillsScore(92);
      setSoftSkillsScore(88);
      setProblemSolvingIndex(94);
      setClubRole('Vice President, Coding Club');
      setFacultyRating(4.9);
      setMentorNote('Exceptional academic consistency and active participation in national coding hackathons.');
    } else if (presetType === 'atRisk') {
      setName('Devendra Singh');
      setRollNo(`22EC${Math.floor(1000 + Math.random() * 900)}`);
      setEmail('devendra.s@oakwood.edu');
      setDepartment('Electronics & Comm');
      setCgpa(5.6);
      setBacklogs(2);
      setExamAvg(54);
      setAttendance(62);
      setTheoryAttendance(60);
      setLabAttendance(65);
      setAttendanceTrend('declining');
      setLmsCompletion(45);
      setLmsLogins(2);
      setLmsDaysInactive(10);
      setCodingScore(38);
      setAptitudeScore(44);
      setMockInterviewRating(2.2);
      setResumeReadiness(40);
      setHackathonsCount(0);
      setCertificationsCount(0);
      setTechnicalSkillsScore(42);
      setSoftSkillsScore(48);
      setProblemSolvingIndex(40);
      setClubRole('None');
      setFacultyRating(2.6);
      setMentorNote('Multiple active backlogs and attendance below 65%. Urgent faculty counseling required.');
    } else if (presetType === 'placementGap') {
      setName('Shreya Narayanan');
      setRollNo(`22IT${Math.floor(1000 + Math.random() * 900)}`);
      setEmail('shreya.n@oakwood.edu');
      setDepartment('Information Tech');
      setCgpa(8.9);
      setBacklogs(0);
      setExamAvg(88);
      setAttendance(92);
      setTheoryAttendance(94);
      setLabAttendance(90);
      setAttendanceTrend('stable');
      setLmsCompletion(94);
      setLmsLogins(6);
      setLmsDaysInactive(1);
      setCodingScore(44);
      setAptitudeScore(50);
      setMockInterviewRating(2.4);
      setResumeReadiness(55);
      setHackathonsCount(0);
      setCertificationsCount(1);
      setTechnicalSkillsScore(58);
      setSoftSkillsScore(74);
      setProblemSolvingIndex(52);
      setClubRole('Active Member');
      setFacultyRating(4.5);
      setMentorNote('Strong theoretical scores in semester exams, but lacks competitive coding practice for campus placements.');
    } else if (presetType === 'practicalCoder') {
      setName('Kunal Bhasin');
      setRollNo(`22AI${Math.floor(1000 + Math.random() * 900)}`);
      setEmail('kunal.b@oakwood.edu');
      setDepartment('AI & ML');
      setCgpa(6.3);
      setBacklogs(1);
      setExamAvg(65);
      setAttendance(68);
      setTheoryAttendance(64);
      setLabAttendance(75);
      setAttendanceTrend('declining');
      setLmsCompletion(65);
      setLmsLogins(4);
      setLmsDaysInactive(4);
      setCodingScore(94);
      setAptitudeScore(85);
      setMockInterviewRating(4.4);
      setResumeReadiness(90);
      setHackathonsCount(4);
      setCertificationsCount(3);
      setTechnicalSkillsScore(95);
      setSoftSkillsScore(80);
      setProblemSolvingIndex(92);
      setClubRole('Technical Lead, AI Society');
      setFacultyRating(3.2);
      setMentorNote('Brilliant software developer and hackathon finalist, but skipping theory classes and running low attendance.');
    }
    setFormError(null);
  };

  // Auto-generate email on name change if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!email || email.includes('@oakwood.edu')) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '.');
      if (generated) setEmail(`${generated}@oakwood.edu`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter the student full name.');
      return;
    }
    if (!rollNo.trim()) {
      setFormError('Please enter the university roll number.');
      return;
    }

    // Assemble raw student record
    const rawStudentInput = {
      id: `stu-${Date.now().toString().slice(-5)}`,
      rollNo: rollNo.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@oakwood.edu`,
      department,
      semester,
      avatarUrl: undefined,
      cgpa: Number(cgpa),
      backlogs: Number(backlogs),
      examAvg: Number(examAvg),
      subjectPerformance: [
        {
          code: 'ENG301',
          name: 'Core Departmental Course I',
          marks: Math.round(cgpa * 9.5),
          grade: cgpa >= 8.5 ? 'A+' : cgpa >= 7.0 ? 'A' : cgpa >= 5.5 ? 'B' : 'F (Backlog)',
          attendance: Number(attendance),
          credits: 4,
        },
        {
          code: 'ENG302',
          name: 'Core Departmental Course II',
          marks: Math.round(cgpa * 9.2),
          grade: cgpa >= 8.5 ? 'A+' : cgpa >= 7.0 ? 'A' : cgpa >= 5.5 ? 'B' : 'C',
          attendance: Number(theoryAttendance),
          credits: 4,
        },
        {
          code: 'ENG303',
          name: 'Specialized Elective',
          marks: Math.round(examAvg),
          grade: examAvg >= 80 ? 'A' : examAvg >= 60 ? 'B' : 'C',
          attendance: Number(attendance),
          credits: 3,
        },
        {
          code: 'ENG304',
          name: 'Practical Technical Lab',
          marks: Math.min(100, Math.round(codingScore * 0.9 + 10)),
          grade: 'A',
          attendance: Number(labAttendance),
          credits: 2,
        },
      ],
      attendance: Number(attendance),
      theoryAttendance: Number(theoryAttendance),
      labAttendance: Number(labAttendance),
      attendanceTrend,
      lmsCompletion: Number(lmsCompletion),
      lmsLogins: Number(lmsLogins),
      lmsDaysInactive: Number(lmsDaysInactive),
      aptitudeScore: Number(aptitudeScore),
      codingScore: Number(codingScore),
      mockInterviewRating: Number(mockInterviewRating),
      resumeReadiness: Number(resumeReadiness),
      hackathonsCount: Number(hackathonsCount),
      certificationsCount: Number(certificationsCount),
      technicalSkillsScore: Number(technicalSkillsScore),
      softSkillsScore: Number(softSkillsScore),
      problemSolvingIndex: Number(problemSolvingIndex),
      clubRole,
      facultyRating: Number(facultyRating),
      studentSatisfaction: Number(studentSatisfaction),
      lmsForumPosts: 4,
      collegeEventsAttended: 3,
      facultyFeedbackSentiment: (Number(facultyRating) >= 3.8 ? 'positive' : Number(facultyRating) >= 3.0 ? 'neutral' : 'concerning') as 'positive' | 'neutral' | 'concerning',
      mentorNote: mentorNote.trim(),
    };

    // Run official mathematical scoring engine
    const analysis = computeSuccessScoreAndExplainability(rawStudentInput);

    const fullStudent: StudentRecord = {
      ...rawStudentInput,
      successScore: analysis.totalScore,
      status: analysis.status,
      segment: analysis.segment,
      isAcademicRisk: analysis.isAcademicRisk,
      isPlacementRisk: analysis.isPlacementRisk,
      scoreAttribution: {
        positiveDrivers: analysis.positiveDrivers,
        negativeDrivers: analysis.negativeDrivers,
        academicContribution: analysis.academicPillar,
        attendanceContribution: analysis.attendancePillar,
        placementContribution: analysis.placementPillar,
        engagementContribution: analysis.lmsPillar,
        feedbackContribution: analysis.engagementPillar,
      },
    };

    onAddStudent(fullStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Realistic Sky Blue Header */}
        <div className="p-5 sm:p-6 border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-600/30 ring-1 ring-sky-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Add Student to Analytics & Success Platform
              </h2>
              <p className="text-xs text-slate-500">
                Input multi-source metrics across all 7 campus streams for real-time risk scoring, explainability, and cohort segmentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Fill Presets Bar - Sky Blue Styled */}
        <div className="px-6 py-2.5 bg-sky-50/80 border-b border-sky-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-sky-900 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>One-Click Realistic Presets:</span>
          </span>
          <button
            type="button"
            onClick={() => applyPreset('flourishing')}
            className="px-2.5 py-1 bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-800 rounded-lg transition-colors shrink-0 shadow-2xs font-medium"
          >
            Flourishing Scholar
          </button>
          <button
            type="button"
            onClick={() => applyPreset('placementGap')}
            className="px-2.5 py-1 bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-800 rounded-lg transition-colors shrink-0 shadow-2xs font-medium"
          >
            High CGPA / Placement Gap
          </button>
          <button
            type="button"
            onClick={() => applyPreset('practicalCoder')}
            className="px-2.5 py-1 bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-800 rounded-lg transition-colors shrink-0 shadow-2xs font-medium"
          >
            Practical Prodigy (Attendance Risk)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('atRisk')}
            className="px-2.5 py-1 bg-white hover:bg-sky-100/60 border border-sky-200 text-rose-700 rounded-lg transition-colors shrink-0 shadow-2xs font-medium"
          >
            Critical Multi-Risk Student
          </button>
        </div>

        {/* Real-time Computed Score Live Preview Strip */}
        <div className="px-6 py-3 bg-gradient-to-r from-sky-100/80 via-sky-50 to-blue-50 border-b border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-950 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>Real-Time Engine Calculation:</span>
            </span>
            <div className="flex items-baseline gap-1 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
              <span className="text-base font-bold font-mono text-sky-600">{livePreview.totalScore}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
              livePreview.status === 'Flourishing' ? 'bg-emerald-100 text-emerald-800' :
              livePreview.status === 'Steady' ? 'bg-sky-100 text-sky-800' :
              livePreview.status === 'Needs Monitoring' ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {livePreview.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Predicted Segment:</span>
            <span className="bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 font-semibold text-slate-800 text-[11px]">
              {livePreview.segment}
            </span>
            {livePreview.isAcademicRisk && (
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                Acad Risk
              </span>
            )}
            {livePreview.isPlacementRisk && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                Place Risk
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Core Student Identification */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>1. Student Identity & Enrollment Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                  placeholder="e.g. 22CS1045"
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.s@oakwood.edu"
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department / Branch</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Data Science">Data Science & Analytics</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="Electronics & Comm">Electronics & Communication</option>
                  <option value="Information Tech">Information Technology</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Academic Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
                >
                  <option value={4}>Semester IV (Sophomore)</option>
                  <option value={5}>Semester V (Junior)</option>
                  <option value={6}>Semester VI (Junior Pre-Placement)</option>
                  <option value={7}>Semester VII (Senior Early Placement Window)</option>
                  <option value={8}>Semester VIII (Graduating Senior)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Pillar (Weight: 30%) */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>2. Academic Records Stream (Weight 30%)</span>
              </div>
              <span className="text-[11px] text-sky-700 font-mono font-semibold">Max 30 pts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cumulative CGPA (0.00 – 10.00)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Active Backlogs Count</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={backlogs}
                  onChange={(e) => setBacklogs(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Midterm Exam Average (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examAvg}
                  onChange={(e) => setExamAvg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Attendance Stream (Weight: 20%) */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>3. Attendance Records Stream (Weight 20%)</span>
              </div>
              <span className="text-[11px] text-sky-700 font-mono font-semibold">Max 20 pts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overall Attendance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={(e) => setAttendance(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theory Class %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={theoryAttendance}
                  onChange={(e) => setTheoryAttendance(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Practical Lab %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={labAttendance}
                  onChange={(e) => setLabAttendance(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">3-Week Trend</label>
                <select
                  value={attendanceTrend}
                  onChange={(e) => setAttendanceTrend(e.target.value as any)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  <option value="improving">Improving (+3% weekly)</option>
                  <option value="stable">Stable (Consistent)</option>
                  <option value="declining">Declining (Drop-off warning)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: LMS Engagement Stream (Weight: 15%) */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-600" />
                <span>4. Learning Management System (LMS) Stream (Weight 15%)</span>
              </div>
              <span className="text-[11px] text-sky-700 font-mono font-semibold">Max 15 pts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly LMS Logins</label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  value={lmsLogins}
                  onChange={(e) => setLmsLogins(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Completion Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={lmsCompletion}
                  onChange={(e) => setLmsCompletion(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Days Since Last Portal Activity</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={lmsDaysInactive}
                  onChange={(e) => setLmsDaysInactive(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Placement & Industry Readiness (Weight: 25%) */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                <span>5. Placement & Industry Assessment Stream (Weight 25%)</span>
              </div>
              <span className="text-[11px] text-sky-700 font-mono font-semibold">Max 25 pts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coding Assessment Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={codingScore}
                  onChange={(e) => setCodingScore(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aptitude Test Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={aptitudeScore}
                  onChange={(e) => setAptitudeScore(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mock Interview Rating (1–5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={mockInterviewRating}
                  onChange={(e) => setMockInterviewRating(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resume ATS Readiness (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={resumeReadiness}
                  onChange={(e) => setResumeReadiness(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Extracurricular & Skills Stream (Weight: 10%) */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center justify-between text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-600" />
                <span>6. Co-Curricular & Skills Assessment Stream (Weight 10%)</span>
              </div>
              <span className="text-[11px] text-sky-700 font-mono font-semibold">Max 10 pts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hackathons Participated</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={hackathonsCount}
                  onChange={(e) => setHackathonsCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certifications Verified</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={certificationsCount}
                  onChange={(e) => setCertificationsCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Skills Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={technicalSkillsScore}
                  onChange={(e) => setTechnicalSkillsScore(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Soft Skills & Leadership</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={softSkillsScore}
                  onChange={(e) => setSoftSkillsScore(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Qualitative Faculty Feedback */}
          <div className="bg-sky-50/40 p-4.5 rounded-xl border border-sky-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>7. Qualitative Faculty Mentor & Satisfaction Feedback</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Mentor Rating (1.0 – 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={facultyRating}
                  onChange={(e) => setFacultyRating(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Satisfaction Score (1 – 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={studentSatisfaction}
                  onChange={(e) => setStudentSatisfaction(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2 border border-sky-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Faculty Advisor / Mentor Note</label>
              <textarea
                rows={2}
                value={mentorNote}
                onChange={(e) => setMentorNote(e.target.value)}
                placeholder="Qualitative observations on student learning velocity, attendance patterns, and career readiness..."
                className="w-full p-2.5 border border-sky-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
              />
            </div>
          </div>

          {/* Modal Submit Footer */}
          <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-[11px]">
              Upon saving, the platform computes the Student Success Score (0-100), segment, and explainability breakdown immediately.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-lg font-bold shadow-md shadow-sky-600/25 flex items-center gap-2 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Save Student & Compute Analytics</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
