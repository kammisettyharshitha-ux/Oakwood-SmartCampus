import React, { useState } from 'react';
import { StudentRecord } from '../types/student';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Laptop, 
  Sliders, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  PlusCircle,
  GraduationCap,
  TrendingUp,
  Award
} from 'lucide-react';
import { computeSuccessScoreAndExplainability } from '../utils/scoringEngine';

interface Student360ModalProps {
  student: StudentRecord;
  onClose: () => void;
  onCreateIntervention: (student: StudentRecord) => void;
}

type ModalTab = 'explainable' | 'academic' | 'placement' | 'lms' | 'aiDiagnostic' | 'simulator';

export const Student360Modal: React.FC<Student360ModalProps> = ({
  student,
  onClose,
  onCreateIntervention,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('explainable');

  // AI Diagnostic State
  const [aiDiagnostic, setAiDiagnostic] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // What-If Simulator State
  const [simAttendance, setSimAttendance] = useState<number>(student.attendance);
  const [simLmsCompletion, setSimLmsCompletion] = useState<number>(student.lmsCompletion);
  const [simCodingScore, setSimCodingScore] = useState<number>(student.codingScore);
  const [simBacklogs, setSimBacklogs] = useState<number>(student.backlogs);

  const fetchAiDiagnostic = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const response = await fetch('/api/gemini/student-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diagnostic');
      }

      const data = await response.json();
      setAiDiagnostic(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error running AI diagnostic');
    } finally {
      setLoadingAi(false);
    }
  };

  // Re-calculate simulated score on the fly
  const simulatedBreakdown = computeSuccessScoreAndExplainability({
    ...student,
    attendance: simAttendance,
    lmsCompletion: simLmsCompletion,
    codingScore: simCodingScore,
    backlogs: simBacklogs,
  });

  const simulatedDelta = Math.round((simulatedBreakdown.totalScore - student.successScore) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-sky-200 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 font-bold text-lg flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-sky-200 shrink-0">
                {student.name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className="text-xs text-sky-700 font-mono tabular-nums bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {student.rollNo}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <span className="font-medium text-slate-700">{student.department}</span>
                <span aria-hidden="true">·</span>
                <span>Semester {student.semester}</span>
                <span aria-hidden="true">·</span>
                <span>{student.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Close */}
          <div className="flex items-center gap-4 self-end sm:self-center">
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Success Score</div>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-sky-600">
                  {student.successScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="text-xs font-semibold text-slate-600">{student.status}</div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-sky-50 rounded-lg transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-sky-100 bg-white flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('explainable')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'explainable'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Explainable Score Drivers</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'academic'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Academic & Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('placement')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'placement'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-600" />
            <span>Placement & Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('lms')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'lms'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-sky-600" />
            <span>LMS & Engagement</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('aiDiagnostic');
              if (!aiDiagnostic && !loadingAi) fetchAiDiagnostic();
            }}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'aiDiagnostic'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Clinical Action Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-sky-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            <span>What-If Simulator</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Explainable Score Drivers */}
          {activeTab === 'explainable' && (
            <div className="space-y-6">
              {/* Segment & Flags Overview */}
              <div className="bg-sky-50/40 rounded-xl p-4.5 border border-sky-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-sky-900">
                      Behavioral Cohort Classification
                    </div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {student.segment}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {student.isAcademicRisk && (
                      <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Academic Risk Flagged
                      </span>
                    )}
                    {student.isPlacementRisk && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> Placement Risk Flagged
                      </span>
                    )}
                    {!student.isAcademicRisk && !student.isPlacementRisk && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Performance On Track
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5-Pillar Score Contribution Composition Bar */}
              <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Score Pillar Composition Breakdown (100 pts total)
                  </h4>
                  <span className="text-xs font-mono tabular-nums text-sky-700 font-semibold">
                    Calculated: {student.successScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                    <div className="text-slate-500 text-[11px] font-medium">Academic Pillar</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {student.scoreAttribution.academicContribution} <span className="text-xs text-slate-400 font-normal">/ 30</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">CGPA & Backlogs</div>
                  </div>

                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                    <div className="text-slate-500 text-[11px] font-medium">Attendance Pillar</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {student.scoreAttribution.attendanceContribution} <span className="text-xs text-slate-400 font-normal">/ 20</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Theory & Lab</div>
                  </div>

                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                    <div className="text-slate-500 text-[11px] font-medium">Placement Pillar</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {student.scoreAttribution.placementContribution} <span className="text-xs text-slate-400 font-normal">/ 25</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Coding & Aptitude</div>
                  </div>

                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                    <div className="text-slate-500 text-[11px] font-medium">LMS Engagement</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {student.scoreAttribution.engagementContribution} <span className="text-xs text-slate-400 font-normal">/ 15</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Portal Submissions</div>
                  </div>

                  <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 col-span-2 sm:col-span-1">
                    <div className="text-slate-500 text-[11px] font-medium">Co-Curricular & Feedback</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {student.scoreAttribution.feedbackContribution} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Hackathons & Faculty</div>
                  </div>
                </div>
              </div>

              {/* SHAP-Inspired Waterfall Drivers: Positive vs Negative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Positive Drivers */}
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span>Positive Attribution Drivers (+ Points)</span>
                  </div>

                  {student.scoreAttribution.positiveDrivers.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No significant positive drivers exceeding cohort baseline.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {student.scoreAttribution.positiveDrivers.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-900">
                            <span>{item.indicator}</span>
                            <span className="text-emerald-700 font-mono tabular-nums">+{item.delta} pts</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Negative Drag Drivers */}
                <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wide">
                    <ArrowDownRight className="w-4 h-4 text-rose-600" />
                    <span>Negative Drag Drivers (- Points Drag)</span>
                  </div>

                  {student.scoreAttribution.negativeDrivers.length === 0 ? (
                    <p className="text-xs text-emerald-700 font-medium">No negative drag indicators detected; healthy profile.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {student.scoreAttribution.negativeDrivers.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-rose-100 shadow-2xs text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-900">
                            <span>{item.indicator}</span>
                            <span className="text-rose-700 font-mono tabular-nums">{item.delta} pts</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Academic & Attendance 360 */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Cumulative CGPA</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.cgpa.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Scale of 10.0</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Active Backlogs</div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${student.backlogs > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {student.backlogs}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Unresolved Courses</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Overall Attendance</div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${student.attendance < 75 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {student.attendance}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Trend: {student.attendanceTrend}</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Exam Marks Average</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.examAvg}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Internal & Semester Avg</div>
                </div>
              </div>

              {/* Subject-Wise Performance Table */}
              <div className="border border-sky-100 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-sky-50/70 px-4 py-3 border-b border-sky-100 font-bold text-xs text-sky-900">
                  Current Semester Course Enrollments & Subject Performance
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-sky-50/40 text-sky-800 uppercase font-semibold text-[10px] tracking-wider border-b border-sky-100">
                    <tr>
                      <th className="py-2.5 px-4">Course Code</th>
                      <th className="py-2.5 px-4">Course Title</th>
                      <th className="py-2.5 px-4 text-right">Marks (%)</th>
                      <th className="py-2.5 px-4 text-right">Grade</th>
                      <th className="py-2.5 px-4 text-right">Attendance</th>
                      <th className="py-2.5 px-4 text-right">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100/60">
                    {student.subjectPerformance.map((sub, i) => (
                      <tr key={i} className="hover:bg-sky-50/30">
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{sub.code}</td>
                        <td className="py-2.5 px-4 text-slate-900 font-medium">{sub.name}</td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">{sub.marks}%</td>
                        <td className="py-2.5 px-4 text-right font-semibold">
                          <span className={sub.grade.includes('F') ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          <span className={sub.attendance < 75 ? 'text-rose-600 font-semibold' : 'text-slate-800'}>
                            {sub.attendance}%
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-500">{sub.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Placement & Skills */}
          {activeTab === 'placement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Coding Assessment</div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${student.codingScore < 50 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {student.codingScore}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Competitive Algorithms</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Aptitude Score</div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${student.aptitudeScore < 55 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {student.aptitudeScore}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Quantitative & Logic</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Mock Interview Rating</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.mockInterviewRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Technical Panel Review</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Resume Readiness</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.resumeReadiness}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">ATS Parser Benchmark</div>
                </div>
              </div>

              {/* Skills Assessment Matrix */}
              <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Core Skills & Behavioral Articulation Evaluation
                </h4>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Technical Competency & Frameworks</span>
                      <span className="font-mono tabular-nums text-sky-700">{student.technicalSkillsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${student.technicalSkillsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Soft Skills & Behavioral Communication</span>
                      <span className="font-mono tabular-nums text-sky-700">{student.softSkillsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${student.softSkillsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Analytical Problem Solving Quotient</span>
                      <span className="font-mono tabular-nums text-sky-700">{student.problemSolvingIndex}%</span>
                    </div>
                    <div className="w-full h-2 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${student.problemSolvingIndex}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LMS & Engagement */}
          {activeTab === 'lms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">LMS Submissions</div>
                  <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${student.lmsCompletion < 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {student.lmsCompletion}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Assignment On-Time Rate</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Weekly Portal Logins</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.lmsLogins} <span className="text-xs text-slate-400 font-normal">/ wk</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{student.lmsDaysInactive} days inactive</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Hackathons & Wins</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.hackathonsCount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{student.clubRole}</div>
                </div>

                <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100">
                  <div className="text-xs text-slate-500 font-medium">Certifications</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {student.certificationsCount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Industry Credentials</div>
                </div>
              </div>

              {/* Mentor & Faculty Qualitative Notes */}
              <div className="bg-sky-50/50 rounded-xl p-5 border border-sky-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-sky-950">
                  <span>Faculty Feedback & Mentor Observation Note</span>
                  <span className="font-mono tabular-nums text-sky-700">
                    Faculty Rating: {student.facultyRating}/5.0 (Sentiment: {student.facultyFeedbackSentiment})
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-sky-200/80 text-xs text-slate-700 italic shadow-2xs">
                  "{student.mentorNote}"
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI Clinical Action Plan (Gemini Model) */}
          {activeTab === 'aiDiagnostic' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Clinical Diagnostic & Remedial Protocol
                  </h3>
                  <p className="text-xs text-slate-500">
                    Domain-tailored synthesis powered by Gemini 3.8 Flash analyzing root causes and generating a 30-day intervention contract
                  </p>
                </div>
                <button
                  onClick={fetchAiDiagnostic}
                  disabled={loadingAi}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin text-sky-600' : ''}`} />
                  <span>{loadingAi ? 'Generating...' : 'Regenerate'}</span>
                </button>
              </div>

              {loadingAi ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-sky-800 font-mono">Synthesizing multi-silo student data via Gemini AI...</p>
                </div>
              ) : aiDiagnostic ? (
                <div className="space-y-5 text-xs">
                  {/* Executive Summary */}
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4.5">
                    <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>Clinical Executive Diagnostic</span>
                    </div>
                    <p className="text-sm text-sky-950 leading-relaxed font-semibold">
                      {aiDiagnostic.executiveSummary}
                    </p>
                  </div>

                  {/* Root Cause Analysis */}
                  <div className="bg-white border border-sky-100 rounded-xl p-5 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Multi-Silo Root Cause Attribution
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {aiDiagnostic.rootCauseAnalysis?.map((rc: any, idx: number) => (
                        <div key={idx} className="p-3 bg-sky-50/40 rounded-xl border border-sky-100 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between font-semibold text-slate-800">
                              <span>{rc.factor}</span>
                              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${rc.impact === 'High' ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                                {rc.impact} Impact
                              </span>
                            </div>
                            <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">{rc.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prioritized 3-Step Action Plan */}
                  <div className="bg-white border border-sky-100 rounded-xl p-5 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Targeted 30-Day Remedial Action Roadmap
                    </h4>
                    <div className="space-y-2.5">
                      {aiDiagnostic.actionPlan?.map((plan: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-sky-50/40 rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {plan.step || idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{plan.title}</div>
                              <p className="text-slate-600 text-xs mt-0.5">{plan.expectedOutcome}</p>
                            </div>
                          </div>
                          <div className="text-right sm:shrink-0 text-slate-500 text-[11px]">
                            <div><strong>Owner:</strong> {plan.owner}</div>
                            <div className="text-slate-400">{plan.timeframe}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projected Recovery & Counselor Talking Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4.5">
                      <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide mb-1">
                        Projected Score Improvement
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-bold font-mono text-emerald-700">
                          {aiDiagnostic.projectedScoreImprovement?.targetSuccessScore || 80}
                        </span>
                        <span className="text-xs text-emerald-700 font-semibold">
                          ({aiDiagnostic.projectedScoreImprovement?.placementProbabilityShift || '+28%'} Placement Odds)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-2">
                        <strong>Key Condition:</strong> {aiDiagnostic.projectedScoreImprovement?.keyCondition}
                      </p>
                    </div>

                    <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4.5">
                      <div className="text-[11px] font-bold text-sky-950 uppercase tracking-wide mb-1">
                        Faculty Advisor 1-on-1 Talking Points
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-700 mt-2">
                        {aiDiagnostic.counselorTalkingPoints?.map((tp: string, idx: number) => (
                          <li key={idx}>{tp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : aiError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {aiError}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 6: What-If Scenario Simulator */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4.5">
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>Decision Intelligence: Interactive What-If Scenario Simulator</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Model how specific intervention milestones (e.g. attendance recovery, clearing backlogs, or coding bootcamps) will mathematically shift this student's composite Success Score and placement risk.
                </p>
              </div>

              {/* Interactive Sliders */}
              <div className="bg-white border border-sky-100 shadow-xs rounded-xl p-5 space-y-5">
                {/* Attendance Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Target Attendance:</span>
                    <span className="font-mono tabular-nums font-bold text-sky-600">{simAttendance}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={simAttendance}
                    onChange={(e) => setSimAttendance(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>50%</span>
                    <span>Current: {student.attendance}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* LMS Completion Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Target LMS Assignment Completion:</span>
                    <span className="font-mono tabular-nums font-bold text-sky-600">{simLmsCompletion}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={simLmsCompletion}
                    onChange={(e) => setSimLmsCompletion(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>40%</span>
                    <span>Current: {student.lmsCompletion}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Coding Score Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Target Coding Assessment Score:</span>
                    <span className="font-mono tabular-nums font-bold text-sky-600">{simCodingScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={simCodingScore}
                    onChange={(e) => setSimCodingScore(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>30%</span>
                    <span>Current: {student.codingScore}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Backlogs Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span>Active Backlogs Count:</span>
                    <span className="font-mono tabular-nums font-bold text-sky-600">{simBacklogs}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={simBacklogs}
                    onChange={(e) => setSimBacklogs(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 (Clean)</span>
                    <span>Current: {student.backlogs}</span>
                    <span>5 Backlogs</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Projection Card */}
              <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 text-white p-5 rounded-xl border border-sky-700 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-sky-200 font-bold">
                      Simulated Projected Success Score
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold font-mono">{simulatedBreakdown.totalScore}</span>
                      <span className="text-xs text-sky-200 font-mono">/ 100</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${simulatedDelta >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {simulatedDelta >= 0 ? `+${simulatedDelta}` : simulatedDelta} pts shift
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="text-[11px] text-sky-200 uppercase tracking-wider font-semibold">New Status Tier</div>
                    <div className="font-bold text-sm text-white mt-1">{simulatedBreakdown.status}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-sky-700/60 flex items-center justify-between text-xs text-sky-100">
                  <div>
                    Academic Risk: {simulatedBreakdown.isAcademicRisk ? <span className="text-rose-300 font-bold">Active</span> : <span className="text-emerald-300 font-bold">Resolved</span>}
                  </div>
                  <div>
                    Placement Risk: {simulatedBreakdown.isPlacementRisk ? <span className="text-amber-300 font-bold">Active</span> : <span className="text-emerald-300 font-bold">Resolved</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-sky-100 bg-sky-50/40 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Student ID: <span className="font-mono text-sky-700">{student.id}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => {
                onClose();
                onCreateIntervention(student);
              }}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-sky-600/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Remedial Intervention</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-sky-50 text-slate-700 border border-sky-200 font-semibold text-xs rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
