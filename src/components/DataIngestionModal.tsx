import React, { useState } from 'react';
import { StudentRecord } from '../types/student';
import { X, Database, CheckCircle2, UploadCloud, RefreshCw, FileText } from 'lucide-react';
import { computeSuccessScoreAndExplainability } from '../utils/scoringEngine';

interface DataIngestionModalProps {
  onClose: () => void;
  onAddStudent: (student: StudentRecord) => void;
  onResetCohort: () => void;
  studentCount: number;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  onClose,
  onAddStudent,
  onResetCohort,
  studentCount,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'manualAdd'>('pipeline');
  const [cleaningStatus, setCleaningStatus] = useState<string | null>(null);

  // Manual Add Form State
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState<StudentRecord['department']>('Computer Science');
  const [semester, setSemester] = useState(6);
  const [cgpa, setCgpa] = useState(7.8);
  const [backlogs, setBacklogs] = useState(0);
  const [attendance, setAttendance] = useState(82);
  const [lmsCompletion, setLmsCompletion] = useState(78);
  const [codingScore, setCodingScore] = useState(65);
  const [aptitudeScore, setAptitudeScore] = useState(70);

  const handleSimulateCleaning = () => {
    setCleaningStatus('validating');
    setTimeout(() => {
      setCleaningStatus('cleaned');
    }, 1200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNo) return;

    const rawInput = {
      id: `stu-${Date.now().toString().slice(-4)}`,
      rollNo,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@oakwood.edu`,
      department,
      semester,
      avatarUrl: undefined,
      cgpa,
      backlogs,
      examAvg: Math.round(cgpa * 9.5),
      subjectPerformance: [
        { code: 'ENG301', name: 'Core Course 1', marks: Math.round(cgpa * 9.5), grade: 'A', attendance, credits: 4 },
        { code: 'ENG302', name: 'Core Course 2', marks: Math.round(cgpa * 9.0), grade: 'A', attendance, credits: 4 },
      ],
      attendance,
      theoryAttendance: attendance,
      labAttendance: attendance,
      attendanceTrend: 'stable' as const,
      lmsLogins: 5,
      lmsCompletion,
      lmsDaysInactive: 2,
      lmsForumPosts: 4,
      hackathonsCount: 1,
      clubRole: 'Member',
      certificationsCount: 1,
      collegeEventsAttended: 3,
      aptitudeScore,
      codingScore,
      mockInterviewRating: 3.5,
      resumeReadiness: 70,
      technicalSkillsScore: codingScore,
      softSkillsScore: 70,
      problemSolvingIndex: aptitudeScore,
      studentSatisfaction: 4,
      facultyRating: 4.0,
      facultyFeedbackSentiment: 'positive' as const,
      mentorNote: 'Manually ingested student record via Smart Campus Admin Pipeline.',
    };

    const breakdown = computeSuccessScoreAndExplainability(rawInput);

    const newStudent: StudentRecord = {
      ...rawInput,
      successScore: breakdown.totalScore,
      status: breakdown.status,
      isAcademicRisk: breakdown.isAcademicRisk,
      isPlacementRisk: breakdown.isPlacementRisk,
      segment: breakdown.segment,
      scoreAttribution: {
        positiveDrivers: breakdown.positiveDrivers,
        negativeDrivers: breakdown.negativeDrivers,
        academicContribution: breakdown.academicPillar,
        attendanceContribution: breakdown.attendancePillar,
        placementContribution: breakdown.placementPillar,
        engagementContribution: breakdown.lmsPillar,
        feedbackContribution: breakdown.engagementPillar,
      },
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-2xl overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 bg-sky-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Multi-Source Data Ingestion & ETL Pipeline
              </h3>
              <p className="text-[11px] text-sky-700 font-mono font-medium">
                Currently Monitored: {studentCount} Enrolled Students
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-sky-100 bg-white flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'pipeline' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            1. Automated ETL Pipeline Status
          </button>
          <button
            onClick={() => setActiveTab('manualAdd')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'manualAdd' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            2. Ingest Single Student Record
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs text-slate-700 space-y-5">
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-2">
                  Connected Campus Data Streams & Sync Protocols
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between py-1 border-b border-sky-100">
                    <span className="font-medium text-slate-800">1. SIS / ERP Registrar (Academic CGPA & Backlogs)</span>
                    <span className="text-emerald-700 font-semibold">Active Sync (REST API)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-sky-100">
                    <span className="font-medium text-slate-800">2. Smart Biometric & RFID Turnstiles (Attendance %)</span>
                    <span className="text-emerald-700 font-semibold">Active Sync (Kafka Stream)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-sky-100">
                    <span className="font-medium text-slate-800">3. LMS Canvas / Moodle (Logins & Assignments)</span>
                    <span className="text-emerald-700 font-semibold">Active Sync (LTI 1.3 Webhooks)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-sky-100">
                    <span className="font-medium text-slate-800">4. Placement Portal & HackerRank/LeetCode Assessments</span>
                    <span className="text-emerald-700 font-semibold">Active Sync (Batch JSON)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-sky-100">
                    <span className="font-medium text-slate-800">5. Faculty Mentorship & Wellbeing Sentiment</span>
                    <span className="text-emerald-700 font-semibold">Active Sync (Survey Portal)</span>
                  </div>
                </div>
              </div>

              {/* Data Cleaning Engine */}
              <div className="p-4 border border-sky-200 bg-sky-50/50 rounded-xl space-y-2">
                <div className="font-bold text-sky-950 flex items-center justify-between">
                  <span>Data Cleaning, Imputation & Harmonization Engine</span>
                  <button
                    onClick={handleSimulateCleaning}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold text-[11px] shadow-xs active:scale-95"
                  >
                    Run Cleaning Routine
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Normalizes inconsistent grading scales, imputes missing LMS login timestamps using moving-window averages, and filters spurious attendance drops caused by campus-wide holidays.
                </p>

                {cleaningStatus === 'validating' && (
                  <div className="text-sky-700 flex items-center gap-2 pt-1 font-mono text-[11px]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating schema integrity and resolving 0 null outliers...</span>
                  </div>
                )}
                {cleaningStatus === 'cleaned' && (
                  <div className="text-emerald-700 flex items-center gap-1.5 pt-1 font-semibold text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ETL pipeline verified: 100% record completeness across all 7 sources.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'manualAdd' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tarun Verma"
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University Roll Number</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 22CS1204"
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={semester}
                    onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGPA (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={10}
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Backlogs</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={backlogs}
                    onChange={(e) => setBacklogs(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={attendance}
                    onChange={(e) => setAttendance(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LMS %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={lmsCompletion}
                    onChange={(e) => setLmsCompletion(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coding Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={codingScore}
                    onChange={(e) => setCodingScore(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aptitude Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={aptitudeScore}
                    onChange={(e) => setAptitudeScore(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-sky-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 font-semibold shadow-xs active:scale-95"
                >
                  Compute Score & Ingest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
