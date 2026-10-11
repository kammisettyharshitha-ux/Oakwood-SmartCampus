import React, { useState, useEffect } from 'react';
import { StudentRecord, InterventionItem } from '../types/student';
import { 
  AlertTriangle, 
  Briefcase, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  ShieldAlert, 
  ChevronRight, 
  Database, 
  UserPlus,
  Layers,
  GraduationCap,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const CAMPUS_IMG = '/src/assets/images/campus_quad_aerial_1791651850196.jpg';

interface OverviewViewProps {
  students: StudentRecord[];
  interventions: InterventionItem[];
  onSelectStudent: (student: StudentRecord) => void;
  onNavigateToRoster: () => void;
  onNavigateToSegments: () => void;
  onNavigateToInterventions: () => void;
  onOpenMethodology: () => void;
  onOpenAddStudent: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  students,
  interventions,
  onSelectStudent,
  onNavigateToRoster,
  onNavigateToSegments,
  onNavigateToInterventions,
  onOpenMethodology,
  onOpenAddStudent,
}) => {
  // Aggregate KPIs
  const totalCount = students.length;
  const avgSuccessScore = Math.round((students.reduce((acc, s) => acc + s.successScore, 0) / (totalCount || 1)) * 10) / 10;
  const avgCgpa = Math.round((students.reduce((acc, s) => acc + s.cgpa, 0) / (totalCount || 1)) * 100) / 100;
  const avgAttendance = Math.round((students.reduce((acc, s) => acc + s.attendance, 0) / (totalCount || 1)) * 10) / 10;
  const avgPlacementScore = Math.round((students.reduce((acc, s) => acc + s.codingScore, 0) / (totalCount || 1)) * 10) / 10;

  const academicRiskStudents = students.filter((s) => s.isAcademicRisk);
  const placementRiskStudents = students.filter((s) => s.isPlacementRisk);
  const dualRiskStudents = students.filter((s) => s.isAcademicRisk && s.isPlacementRisk);
  const flourishingStudents = students.filter((s) => s.status === 'Flourishing');

  // AI Cohort Briefing state
  const [aiBriefing, setAiBriefing] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  const fetchCohortBriefing = async () => {
    setLoadingAi(true);
    setBriefingError(null);
    try {
      const departmentBreakdown: Record<string, number> = {};
      students.forEach((s) => {
        departmentBreakdown[s.department] = (departmentBreakdown[s.department] || 0) + 1;
      });

      const response = await fetch('/api/gemini/cohort-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortMetrics: {
            avgSuccessScore,
            avgCgpa,
            avgAttendance,
            avgLmsCompletion: Math.round(students.reduce((acc, s) => acc + s.lmsCompletion, 0) / (totalCount || 1)),
            avgPlacementIndex: avgPlacementScore,
          },
          departmentBreakdown,
          highRiskCount: academicRiskStudents.length,
          totalStudents: totalCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI executive briefing');
      }

      const data = await response.json();
      setAiBriefing(data);
    } catch (err: any) {
      console.error(err);
      setBriefingError(err.message || 'Unable to load briefing');
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchCohortBriefing();
  }, [students.length]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Realistic Sky Blue Campus Hero & Trust Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-sky-200 bg-gradient-to-r from-sky-950 via-sky-900 to-sky-800 shadow-lg shadow-sky-950/10">
        <div className="absolute inset-0">
          <img 
            src={CAMPUS_IMG} 
            alt="Oakwood Innovation University Campus" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/95 via-sky-900/85 to-sky-800/70" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white max-w-3xl">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Oakwood Institute of Technology & Engineering</span>
            <span aria-hidden="true">·</span>
            <span>Academic Year 2026</span>
            <span aria-hidden="true">·</span>
            <span>Early Detection Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            Smart Campus Analytics & Decision Intelligence
          </h1>
          <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed mb-6">
            Proactively identifying students at risk across 7 integrated data silos—academics, attendance, LMS, placement readiness, skills, and faculty feedback—with explainable scores and targeted remediation.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-md shadow-sky-900/30 ring-1 ring-white/20 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student Details</span>
            </button>
            <button
              onClick={onNavigateToRoster}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center gap-2 border border-white/20 backdrop-blur-sm"
            >
              <span>Explore Student 360 Roster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenMethodology}
              className="px-4 py-2.5 bg-sky-900/70 hover:bg-sky-900 border border-sky-400/30 text-sky-100 font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-sky-300" />
              <span>Review Scoring Formula</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Quantitative KPI Strip - Sky Blue Accented Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-sky-100 hover:border-sky-300 shadow-sm shadow-sky-950/5 flex flex-col justify-between transition-all">
          <div className="text-xs font-medium text-slate-500 mb-1">Total Enrolled Cohort</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">{totalCount}</span>
            <span className="text-xs text-sky-600 font-medium">Students</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>6 Departments</span>
            <button onClick={onOpenAddStudent} className="text-sky-600 font-semibold hover:underline">
              + Add
            </button>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-sky-100 hover:border-sky-300 shadow-sm shadow-sky-950/5 flex flex-col justify-between transition-all">
          <div className="text-xs font-medium text-slate-500 mb-1">Campus Success Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-sky-600">{avgSuccessScore}</span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">/ 100</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600">{flourishingStudents.length}</span>
            <span>Flourishing ({Math.round((flourishingStudents.length / (totalCount || 1)) * 100)}%)</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-sky-100 hover:border-sky-300 shadow-sm shadow-sky-950/5 flex flex-col justify-between transition-all">
          <div className="text-xs font-medium text-slate-500 mb-1">Academic Risk Cohort</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600">{academicRiskStudents.length}</span>
            <span className="text-xs text-slate-500">({Math.round((academicRiskStudents.length / (totalCount || 1)) * 100)}%)</span>
          </div>
          <div className="mt-3 text-xs text-rose-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Backlogs / &lt;75% Attn</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-sky-100 hover:border-sky-300 shadow-sm shadow-sky-950/5 flex flex-col justify-between transition-all">
          <div className="text-xs font-medium text-slate-500 mb-1">Placement Vulnerability</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-600">{placementRiskStudents.length}</span>
            <span className="text-xs text-slate-500">({Math.round((placementRiskStudents.length / (totalCount || 1)) * 100)}%)</span>
          </div>
          <div className="mt-3 text-xs text-amber-700 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Low coding readiness</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-5 rounded-xl border border-sky-100 hover:border-sky-300 shadow-sm shadow-sky-950/5 flex flex-col justify-between col-span-2 md:col-span-1 transition-all">
          <div className="text-xs font-medium text-slate-500 mb-1">Active Interventions</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">{interventions.length}</span>
            <span className="text-xs text-slate-500">Scheduled</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
            <span>{interventions.filter((i) => i.status === 'In Progress').length} in progress</span>
            <button 
              onClick={onNavigateToInterventions}
              className="text-sky-600 hover:text-sky-800 font-semibold"
            >
              Manage &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Quick Action Feature Strip */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50/70 border border-sky-200/90 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm shadow-sky-600/30 shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Faculty Action Center: Add & Enroll New Student Record
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Input student metrics across all 7 data streams (Academic, Attendance, LMS, Placement, Skills, Feedback) to compute their Success Score and at-risk segmentation in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="self-start sm:self-center px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-sky-600/20 whitespace-nowrap active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Student Details</span>
        </button>
      </div>

      {/* 3. AI Institutional Strategic Intelligence Briefing - Sky Blue Themed */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI Strategic Executive Intelligence Briefing
              </h2>
              <p className="text-xs text-slate-500">
                Synthesized cross-silo institutional patterns, leading indicator warnings, and policy directives
              </p>
            </div>
          </div>

          <button
            onClick={fetchCohortBriefing}
            disabled={loadingAi}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin text-sky-600' : ''}`} />
            <span>{loadingAi ? 'Analyzing Cohort...' : 'Refresh AI Synthesis'}</span>
          </button>
        </div>

        {loadingAi && !aiBriefing ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-7 h-7 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-sky-800 font-mono">Running cross-silo regression & predictive analytics...</p>
          </div>
        ) : aiBriefing ? (
          <div className="pt-5 space-y-5">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <div className="text-xs font-bold text-sky-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Institutional Executive Takeaway</span>
              </div>
              <p className="text-sm font-semibold text-sky-950">
                {aiBriefing.institutionalHeadline}
              </p>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {aiBriefing.macroAnalysis}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Vulnerable segments */}
              <div className="bg-sky-50/40 rounded-xl p-4 border border-sky-100">
                <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Vulnerable Segments Requiring Protocol Action</span>
                </div>
                <div className="space-y-3">
                  {aiBriefing.vulnerableSegments?.map((seg: any, idx: number) => (
                    <div key={idx} className="text-xs border-b border-sky-100 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{seg.segment}</span>
                        <span className="text-rose-600 font-mono tabular-nums">{seg.affectedCountEstimate}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{seg.strategicRemedy}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource allocation */}
              <div className="bg-sky-50/40 rounded-xl p-4 border border-sky-100">
                <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>Recommended Resource Allocation & Policy Directives</span>
                </div>
                <div className="space-y-3">
                  {aiBriefing.resourceAllocationRecommendations?.map((rec: any, idx: number) => (
                    <div key={idx} className="text-xs border-b border-sky-100 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{rec.departmentOrCell}</span>
                        <span className="text-slate-500">{rec.budgetPriority} Priority</span>
                      </div>
                      <p className="text-slate-600 mt-1">{rec.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {aiBriefing.projectedRetentionImpact && (
              <div className="text-xs text-slate-600 bg-sky-50/60 border border-sky-200 rounded-lg p-3 flex items-center justify-between">
                <span><strong>Projected 45-Day Impact:</strong> {aiBriefing.projectedRetentionImpact}</span>
              </div>
            )}
          </div>
        ) : briefingError ? (
          <div className="py-4 text-xs text-rose-600">{briefingError}</div>
        ) : null}
      </div>

      {/* 4. Cross-Silo Interactive Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual 1: Academic CGPA vs Placement Coding Readiness Quadrant */}
        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Academic CGPA vs. Placement Coding Quotient
              </h3>
              <p className="text-xs text-slate-500">
                Quadrant analysis detecting the institutional blind spot: High CGPA with Low Placement readiness
              </p>
            </div>
            <button
              onClick={onNavigateToSegments}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 whitespace-nowrap"
            >
              View Segments &rarr;
            </button>
          </div>

          {/* Quadrant Scatter Container */}
          <div className="relative mt-6 h-72 border border-sky-100 rounded-xl bg-sky-50/30 p-4">
            {/* Quadrant Lines */}
            <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-sky-200 pointer-events-none" />
            <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-sky-200 pointer-events-none" />

            {/* Quadrant Labels */}
            <div className="absolute top-2 left-2 text-[10px] font-semibold text-amber-700 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/50">
              Practical Prodigies (High Code, Low CGPA)
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50/90 px-1.5 py-0.5 rounded border border-emerald-200/50">
              Flourishing All-Rounders
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-rose-700 bg-rose-50/90 px-1.5 py-0.5 rounded border border-rose-200/50">
              Multi-Risk Critical Intervention
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-semibold text-sky-800 bg-sky-100/90 px-1.5 py-0.5 rounded border border-sky-300/60">
              High Academic, Low Placement (Blind Spot)
            </div>

            {/* Scatter Dots */}
            <div className="relative w-full h-full">
              {students.map((student) => {
                // X: CGPA from 5.0 to 10.0 (0% to 100%)
                const xPercent = Math.max(5, Math.min(95, ((student.cgpa - 5.0) / 5.0) * 100));
                // Y: Coding Score from 30 to 100 (inverted for canvas Y)
                const yPercent = Math.max(8, Math.min(92, 100 - ((student.codingScore - 30) / 70) * 100));

                let dotColor = 'bg-slate-400 hover:bg-slate-600';
                if (student.segment === 'High Academic, Low Placement') {
                  dotColor = 'bg-sky-600 hover:bg-sky-800 ring-2 ring-sky-200';
                } else if (student.segment === 'Practical Prodigy, Academic Risk') {
                  dotColor = 'bg-amber-600 hover:bg-amber-800 ring-2 ring-amber-200';
                } else if (student.segment === 'Multi-Risk Critical') {
                  dotColor = 'bg-rose-600 hover:bg-rose-800 ring-2 ring-rose-200';
                } else if (student.segment === 'Flourishing All-Rounder') {
                  dotColor = 'bg-emerald-600 hover:bg-emerald-800 ring-2 ring-emerald-200';
                }

                return (
                  <button
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${dotColor} transition-transform hover:scale-150 cursor-pointer shadow-sm group`}
                    title={`${student.name}: CGPA ${student.cgpa}, Coding ${student.codingScore}%, Success: ${student.successScore}`}
                  >
                    <span className="sr-only">{student.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>&larr; CGPA 5.0 (Low)</span>
            <span className="font-semibold text-slate-600">Normalized CGPA</span>
            <span>CGPA 10.0 (High) &rarr;</span>
          </div>
        </div>

        {/* Visual 2: Student Success Score Distribution */}
        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Success Score Distribution Curve
                </h3>
                <p className="text-xs text-slate-500">
                  Tiered population breakdown across synthesized 0–100 Success Scores
                </p>
              </div>
              <button
                onClick={onOpenMethodology}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                Score Logic &rarr;
              </button>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3 mt-6">
              {[
                {
                  label: 'Flourishing Tier (80 – 100)',
                  desc: 'High academic, strong placement prep, active engagement',
                  count: students.filter((s) => s.status === 'Flourishing').length,
                  color: 'bg-emerald-600',
                  textColor: 'text-emerald-700',
                },
                {
                  label: 'Steady Core (65 – 79)',
                  desc: 'Stable academic standing, consistent attendance, on track',
                  count: students.filter((s) => s.status === 'Steady').length,
                  color: 'bg-sky-600',
                  textColor: 'text-sky-700',
                },
                {
                  label: 'Needs Monitoring (50 – 64)',
                  desc: 'Early warning indicators: attendance drop or placement gap',
                  count: students.filter((s) => s.status === 'Needs Monitoring').length,
                  color: 'bg-amber-600',
                  textColor: 'text-amber-700',
                },
                {
                  label: 'Critical Risk (< 50)',
                  desc: 'Active backlogs, severe attendance deficit (<70%), multi-risk',
                  count: students.filter((s) => s.status === 'Critical Risk').length,
                  color: 'bg-rose-600',
                  textColor: 'text-rose-700',
                },
              ].map((tier, idx) => {
                const percent = Math.round((tier.count / (totalCount || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{tier.label}</span>
                      <span className="font-mono tabular-nums text-slate-600">
                        {tier.count} students ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                      <div 
                        className={`h-full ${tier.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{tier.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cohort Mean: <strong className="font-mono tabular-nums text-slate-800">{avgSuccessScore}</strong></span>
            <span>Median Attendance: <strong className="font-mono tabular-nums text-slate-800">{avgAttendance}%</strong></span>
            <span>Average CGPA: <strong className="font-mono tabular-nums text-slate-800">{avgCgpa}</strong></span>
          </div>
        </div>
      </div>

      {/* 5. Early Warning Action Queue (Top Priority Students Requiring Intervention) */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Priority Early Warning & Intervention Queue
            </h3>
            <p className="text-xs text-slate-500">
              Students identified with critical academic backlogs, attendance drop-offs, or severe placement gaps
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddStudent}
              className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-sky-600" />
              <span>+ Add Student</span>
            </button>
            <button
              onClick={onNavigateToRoster}
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800"
            >
              <span>View All {totalCount} Students</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-50/60 text-[11px] uppercase tracking-wider font-semibold text-sky-900 border-b border-sky-100">
              <tr>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Success Score</th>
                <th className="py-3 px-4 text-right">CGPA / Backlogs</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-right">Coding Score</th>
                <th className="py-3 px-4">Identified Segment</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/60">
              {students
                .filter((s) => s.isAcademicRisk || s.isPlacementRisk)
                .sort((a, b) => a.successScore - b.successScore)
                .slice(0, 6)
                .map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => onSelectStudent(student)}
                    className="hover:bg-sky-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums">{student.rollNo}</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{student.department}</div>
                      <div className="text-slate-400">Sem {student.semester}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono tabular-nums font-bold text-slate-900">
                        {student.successScore}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {student.status}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs">
                      <div className="font-semibold text-slate-900">{student.cgpa.toFixed(2)}</div>
                      {student.backlogs > 0 ? (
                        <div className="text-rose-600 font-medium">{student.backlogs} backlog{student.backlogs > 1 ? 's' : ''}</div>
                      ) : (
                        <div className="text-slate-400">0 backlogs</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs">
                      <div className={student.attendance < 75 ? 'text-rose-600 font-semibold' : 'text-slate-900'}>
                        {student.attendance}%
                      </div>
                      <div className="text-[11px] text-slate-400">LMS: {student.lmsCompletion}%</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs">
                      <div className={student.codingScore < 55 ? 'text-amber-600 font-semibold' : 'text-slate-900'}>
                        {student.codingScore}%
                      </div>
                      <div className="text-[11px] text-slate-400">Apt: {student.aptitudeScore}%</div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-medium text-slate-700">
                        {student.segment}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200"
                      >
                        Diagnose 360 &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
