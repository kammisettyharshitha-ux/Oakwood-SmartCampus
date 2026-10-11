import React, { useState } from 'react';
import { StudentRecord, StudentSegment } from '../types/student';
import { 
  Users, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Flame, 
  AlertOctagon, 
  Sparkles, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface CohortSegmentsViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onOpenCreateIntervention: (student: StudentRecord) => void;
}

interface SegmentMeta {
  title: StudentSegment;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  borderAccent: string;
  recommendedAction: string;
  targetFocus: string;
}

const SEGMENT_DEFINITIONS: SegmentMeta[] = [
  {
    title: 'High Academic, Low Placement',
    subtitle: 'Institutional Blind Spot: High CGPA, Low Placement Readiness',
    description: 'Students who excel in semester theory examinations (CGPA ≥ 7.5) but demonstrate critical deficits in timed coding rounds (Score < 60%), quantitative aptitude, or mock interviews.',
    icon: <Briefcase className="w-5 h-5 text-sky-600" />,
    borderAccent: 'border-sky-200 bg-sky-50/40',
    recommendedAction: 'Enroll immediately in 4-week competitive programming sprints, LeetCode curated tracks, and 1-on-1 behavioral interview clinics.',
    targetFocus: 'Career Relations & Technical Training Cell',
  },
  {
    title: 'Practical Prodigy, Academic Risk',
    subtitle: 'High Technical Chops with Attendance & Backlog Risk',
    description: 'Gifted builders and hackathon winners who neglect attendance regulations (<72%) or theory requirements, risking exam hall ticket debarment despite stellar software skills.',
    icon: <Flame className="w-5 h-5 text-amber-600" />,
    borderAccent: 'border-amber-200 bg-amber-50/20',
    recommendedAction: 'Sign departmental attendance recovery compact; grant academic credit equivalency for proven open-source/hackathon milestones.',
    targetFocus: 'Head of Department & Academic Dean',
  },
  {
    title: 'Disengaged Attrition Vector',
    subtitle: 'Sudden LMS Drop-off, Inactivity & Attendance Slip',
    description: 'Students with previously solid foundations experiencing abrupt drops in weekly LMS logins (>7 days inactive) and attendance declines. Classic early symptom of burnout or personal duress.',
    icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
    borderAccent: 'border-rose-200 bg-rose-50/20',
    recommendedAction: 'Proactive wellness counseling check-in; faculty mentor 1-on-1 discovery before midterms.',
    targetFocus: 'Student Counseling & Mentor Liaison',
  },
  {
    title: 'Multi-Risk Critical',
    subtitle: 'Compounding Academic & Placement Crisis',
    description: 'Students simultaneously below statutory attendance (60–70%), carrying active exam backlogs, and scoring in the lower quartile of placement readiness tests.',
    icon: <AlertOctagon className="w-5 h-5 text-rose-700" />,
    borderAccent: 'border-rose-300 bg-rose-50/30',
    recommendedAction: 'Emergency multidisciplinary intervention: parent-teacher conference, paired peer tutoring, and individual study roadmap.',
    targetFocus: 'Dean of Academics & Parent Coordination',
  },
  {
    title: 'Flourishing All-Rounder',
    subtitle: 'Campus Role Models Across All 7 Streams',
    description: 'Top-tier achievers maintaining CGPA ≥ 8.2, attendance ≥ 82%, strong coding scores (≥ 75%), active club involvement, and multiple certifications.',
    icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
    borderAccent: 'border-emerald-200 bg-emerald-50/20',
    recommendedAction: 'Recommend for prestige corporate fellowships, research lab assistantships, and peer-mentorship leadership roles.',
    targetFocus: 'Dean of Research & Talent Development',
  },
  {
    title: 'Steady Core Contributor',
    subtitle: 'Consistent Performance Meeting Benchmarks',
    description: 'Reliable students operating within normal distributions across attendance, academic assignments, and skill assessments.',
    icon: <ShieldCheck className="w-5 h-5 text-sky-600" />,
    borderAccent: 'border-sky-200 bg-sky-50/20',
    recommendedAction: 'Routine semester monitoring; encourage elective certifications and career exploration workshops.',
    targetFocus: 'Faculty Class In-Charge',
  },
];

export const CohortSegmentsView: React.FC<CohortSegmentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenCreateIntervention,
}) => {
  const [activeSegmentTab, setActiveSegmentTab] = useState<StudentSegment>('High Academic, Low Placement');
  const [bulkActionSent, setBulkActionSent] = useState<string | null>(null);

  const activeMeta = SEGMENT_DEFINITIONS.find((s) => s.title === activeSegmentTab) || SEGMENT_DEFINITIONS[0];
  const segmentStudents = students.filter((s) => s.segment === activeSegmentTab);

  const handleBulkTrigger = (segmentTitle: string) => {
    setBulkActionSent(segmentTitle);
    setTimeout(() => setBulkActionSent(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Cohort Behavioral Segmentation Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Going beyond simple grade averages: grouping students into distinct behavioral profiles to power targeted, data-driven institutional interventions.
        </p>
      </div>

      {/* Segment Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEGMENT_DEFINITIONS.map((def) => {
          const count = students.filter((s) => s.segment === def.title).length;
          const percent = Math.round((count / (students.length || 1)) * 100);
          const isSelected = activeSegmentTab === def.title;

          return (
            <button
              key={def.title}
              onClick={() => setActiveSegmentTab(def.title)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-sky-500 bg-white ring-2 ring-sky-500/20 shadow-sm'
                  : 'border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                  {def.icon}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{count}</span>
                  <span className="text-xs text-sky-600 ml-1 font-semibold">({percent}%)</span>
                </div>
              </div>

              <div className="mt-3 font-semibold text-sm text-slate-900">{def.title}</div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{def.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Active Segment Detail Card */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Active Cohort Segment Deep-Dive
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                · {segmentStudents.length} Students
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{activeMeta.title}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{activeMeta.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkTrigger(activeMeta.title)}
              disabled={bulkActionSent === activeMeta.title || segmentStudents.length === 0}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
            >
              {bulkActionSent === activeMeta.title ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Protocol Deployed ({segmentStudents.length})</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Deploy Cohort Protocol to All {segmentStudents.length}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommended Strategy Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 text-xs">
            <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wide">
              Targeted Institutional Action Protocol
            </div>
            <p className="text-slate-800 font-medium mt-1 leading-relaxed">{activeMeta.recommendedAction}</p>
          </div>

          <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 text-xs">
            <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wide">
              Responsible Department & Stakeholders
            </div>
            <p className="text-slate-800 font-medium mt-1 leading-relaxed">{activeMeta.targetFocus}</p>
          </div>
        </div>

        {/* Enrolled Students Table in this Segment */}
        <div>
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Students Classified Under This Cohort ({segmentStudents.length})
          </div>

          {segmentStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No students are currently classified in this segment.
            </div>
          ) : (
            <div className="border border-sky-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50/70 text-[10px] uppercase font-semibold text-sky-900 border-b border-sky-100">
                  <tr>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Success Score</th>
                    <th className="py-2.5 px-3 text-right">CGPA</th>
                    <th className="py-2.5 px-3 text-right">Attendance</th>
                    <th className="py-2.5 px-3 text-right">Coding Score</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100/60">
                  {segmentStudents.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-sky-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">{student.rollNo}</div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-600">
                        <div>{student.department}</div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {student.successScore}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold">
                        {student.cgpa.toFixed(2)}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={student.attendance < 75 ? 'text-rose-600 font-semibold' : 'text-slate-800'}>
                          {student.attendance}%
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        <span className={student.codingScore < 50 ? 'text-amber-600 font-semibold' : 'text-slate-800'}>
                          {student.codingScore}%
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors border border-sky-200"
                          >
                            Diagnose 360
                          </button>
                          <button
                            onClick={() => onOpenCreateIntervention(student)}
                            className="px-2.5 py-1 text-[11px] text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            Intervene
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
