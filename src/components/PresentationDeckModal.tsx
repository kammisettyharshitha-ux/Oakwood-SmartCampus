import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Database, 
  Layers, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  CheckCircle,
  FileText
} from 'lucide-react';

interface PresentationDeckModalProps {
  onClose: () => void;
  onExplorePrototype: () => void;
}

interface SlideData {
  number: number;
  category: string;
  title: string;
  subtitle: string;
  bullets: { headline: string; detail: string }[];
  takeaway: string;
  speakerNotes: string;
}

const SLIDES: SlideData[] = [
  {
    number: 1,
    category: 'The Problem Context',
    title: 'The Fragmented Campus: Why Colleges Fail to Act in Time',
    subtitle: 'Vast campus data exists in isolated silos, turning early warning opportunities into post-mortem regrets.',
    bullets: [
      {
        headline: 'Data Silo Paralysis',
        detail: 'Attendance registers, Moodle/Canvas LMS logs, semester exam records, and placement assessment portals operate in independent vacuums.',
      },
      {
        headline: 'The CGPA Blind Spot',
        detail: 'Colleges wait until end-of-semester exam marks are published. By then, student backlogs are locked in and placement interview windows have closed.',
      },
      {
        headline: 'Passive Dashboards vs. Decision Intelligence',
        detail: 'Standard dashboards only report raw statistics. Administrators need proactive, explainable guidance telling them exactly WHO to help, WHEN, and HOW.',
      },
    ],
    takeaway: 'Core Opportunity: Integrate multi-source signals into a single unified Student 360 profile to catch disengagement weeks before exam failure.',
    speakerNotes: 'Start by highlighting the challenge brief: colleges possess attendance, LMS, and placement data, but lack a unified intelligence engine. Our platform solves this disconnect.',
  },
  {
    number: 2,
    category: 'Data Integration Architecture',
    title: 'Unifying 7 Critical Campus Data Streams',
    subtitle: 'A single, cohesive data lake capturing the holistic student journey across academic, behavioral, and practical dimensions.',
    bullets: [
      {
        headline: '1. Academic Records',
        detail: 'Cumulative CGPA (0–10 scale), internal assessment averages, active backlog counts, and subject-wise grades.',
      },
      {
        headline: '2. Attendance & Discipline',
        detail: 'Overall attendance %, theory vs. lab breakdown, and 3-week moving trend (improving, stable, declining).',
      },
      {
        headline: '3. LMS & Digital Engagement',
        detail: 'Weekly login frequency, assignment completion rate on course portals, and days of inactivity.',
      },
      {
        headline: '4. Placement & Practical Readiness',
        detail: 'Timed algorithmic coding scores (LeetCode benchmark), quantitative aptitude tests, mock interview ratings (1–5), and resume ATS readiness.',
      },
      {
        headline: '5. Skills, Extracurriculars & Feedback',
        detail: 'Hackathons won, technical certifications, faculty qualitative notes, and student satisfaction sentiment.',
      },
    ],
    takeaway: 'Multi-Silo Integration: Gives academic deans and placement directors complete 360-degree situational awareness.',
    speakerNotes: 'Point out the breadth of indicators in the scope table: academic, attendance, LMS, engagement, placement, skills, and faculty feedback are all normalized together.',
  },
  {
    number: 3,
    category: 'Scoring Engine & Explainability',
    title: 'The Student Success Score: Transparent, Normalized, Explainable',
    subtitle: 'A composite 0–100 score with zero black-box obscurity: every point addition and penalty is fully traceable.',
    bullets: [
      {
        headline: 'Transparent 5-Pillar Weight Matrix',
        detail: 'Academic Mastery (30%) + Placement Readiness (25%) + Attendance Discipline (20%) + LMS Engagement (15%) + Holistic Co-Curricular (10%).',
      },
      {
        headline: 'Statutory Penalty Clamps',
        detail: 'Active exam backlogs incur a steep statutory penalty (-8 pts each); attendance <75% triggers sharp non-linear drops reflecting university debarment risk.',
      },
      {
        headline: 'SHAP-Inspired Explainability Drivers',
        detail: 'Every student view shows exact positive drivers (+12.4 pts for Coding) and negative drags (-16.0 pts for Backlogs) relative to cohort means.',
      },
    ],
    takeaway: 'Explainable AI: Faculty advisors can sit with students and transparently explain the exact levers driving their performance trajectory.',
    speakerNotes: 'Emphasize the bonus credit for Explainable Score: judges want to see visible drivers behind each score and risk flag. Our SHAP-inspired waterfall solves this directly.',
  },
  {
    number: 4,
    category: 'At-Risk Early Detection',
    title: 'Dual-Vector At-Risk Prediction: Academic vs. Placement',
    subtitle: 'Students rarely fail in only one dimension. We detect vulnerabilities before they become irrecoverable.',
    bullets: [
      {
        headline: 'Vector A: Academic Performance Risk',
        detail: 'Triggered when CGPA < 6.5, backlogs > 0, attendance < 75%, or LMS completion < 60%. Pre-emptive alert before midterm exams.',
      },
      {
        headline: 'Vector B: Placement Outcome Risk',
        detail: 'Triggered when coding assessment < 55%, aptitude < 55%, or mock interview < 2.8/5. Identifies students who pass exams but face job market failure.',
      },
      {
        headline: 'Compound Dual-Risk Protocol',
        detail: 'Students caught in both vectors receive escalated emergency status, triggering parental notifications and assigned senior faculty mentors.',
      },
    ],
    takeaway: 'Proactive Early-Warning: Shifts institution from reactive post-mortems to pre-emptive remediation during weeks 4–8.',
    speakerNotes: 'Walk judges through the dual-vector concept. A student can have a 9.2 CGPA but be at severe placement risk; another may be an ace coder risking attendance debarment.',
  },
  {
    number: 5,
    category: 'Cohort Segmentation',
    title: 'Behavioral Student Segmentation for Targeted Action',
    subtitle: 'Moving beyond arbitrary quartiles: actionable personas grouped by behavioral vectors to allocate campus resources effectively.',
    bullets: [
      {
        headline: 'High Academic, Low Placement (Institutional Blind Spot)',
        detail: 'Strong in theory exams but failing coding screens. Routed to 4-week competitive programming sprints and technical interview bootcamps.',
      },
      {
        headline: 'Practical Prodigy, Academic Risk',
        detail: 'Outstanding hackathon developers skipping lecture attendance. Addressed via faculty credit compacts and project-based attendance equivalencies.',
      },
      {
        headline: 'Disengaged Attrition Vector',
        detail: 'Sudden drop in LMS activity (>7 days inactive) and attendance decline. Flagged for counselor 1-on-1 discovery and mental health check-ins.',
      },
    ],
    takeaway: 'Targeted Interventions: Different student segments receive precise institutional protocols rather than generic mass emails.',
    speakerNotes: 'Highlight the bonus credit for Student Segmentation: we demonstrate meaningful segments like High Academic Low Placement that directly guide intervention teams.',
  },
  {
    number: 6,
    category: 'Decision Intelligence in Action',
    title: 'Closing the Loop: Real-Time Remedial Tracking & AI Diagnostics',
    subtitle: 'From predictive insight to verified student outcome: tracking remedial progress with continuous feedback loops.',
    bullets: [
      {
        headline: 'Remedial Action Kanban Board',
        detail: 'Assign counselors, set measurable target metrics (e.g. attendance >75%), define deadlines, and track remediation statuses to resolution.',
      },
      {
        headline: 'Gemini 3.8 Flash Clinical Diagnostics',
        detail: 'Generates customized multi-silo root cause analysis, 30-day recovery roadmaps, projected score deltas, and talking points for 1-on-1 advisor sessions.',
      },
      {
        headline: 'Interactive What-If Scenario Simulator',
        detail: 'Enables administrators and students to model real-time improvements in attendance or coding scores to simulate projected Success Score shifts.',
      },
    ],
    takeaway: 'Measurable Campus ROI: A complete cycle from raw disparate data to predictive scoring, explainable drivers, and verified remediation.',
    speakerNotes: 'Conclude with the working prototype transition. Emphasize that all features described in this deck are fully implemented and interactively usable in the live application.',
  },
];

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  onClose,
  onExplorePrototype,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const slide = SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Deck Header Bar */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-sky-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Executive Presentation: Smart Campus Analytics Platform
              </div>
              <div className="text-[11px] text-sky-700 font-mono font-medium">
                Slide {slide.number} of {SLIDES.length} · {slide.category}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                showSpeakerNotes
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-white text-slate-600 border-sky-200 hover:bg-sky-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Speaker Notes {showSpeakerNotes ? '(On)' : '(Off)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-sky-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="p-6 sm:p-10 md:p-12 space-y-6 flex-1 bg-gradient-to-b from-white to-sky-50/30">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              {slide.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1" style={{ textWrap: 'balance' }}>
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {slide.subtitle}
            </p>
          </div>

          {/* Slide Content Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {slide.bullets.map((b, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-sky-100 shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-700 font-bold font-mono text-xs flex items-center justify-center mb-2 border border-sky-200">
                    0{idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{b.headline}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{b.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Big Takeaway Callout */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs font-semibold text-sky-950 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-sky-600 shrink-0" />
            <span>{slide.takeaway}</span>
          </div>

          {/* Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <div className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
                Presenter Script & Judicial Focus Notes
              </div>
              <p className="leading-relaxed">{slide.speakerNotes}</p>
            </div>
          )}
        </div>

        {/* Deck Navigation Controls Footer */}
        <div className="p-4 sm:p-5 border-t border-sky-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlideIndex
                    ? 'w-8 bg-sky-600'
                    : 'bg-sky-200 hover:bg-sky-300'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="px-3.5 py-2 text-xs font-semibold border border-sky-200 rounded-lg disabled:opacity-40 hover:bg-sky-50 transition-colors flex items-center gap-1 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentSlideIndex < SLIDES.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onExplorePrototype();
                }}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Launch Live Prototype</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
