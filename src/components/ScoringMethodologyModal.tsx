import React, { useState } from 'react';
import { X, Database, Sliders, CheckCircle2, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';

interface ScoringMethodologyModalProps {
  onClose: () => void;
}

export const ScoringMethodologyModal: React.FC<ScoringMethodologyModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'formulation' | 'indicators' | 'riskRules' | 'explainability'>('formulation');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Methodology Whitepaper Note
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Student Success Score & Risk Prediction Architecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 border-b border-sky-100 bg-white flex items-center gap-2 overflow-x-auto text-xs font-medium shrink-0">
          {[
            { id: 'formulation', label: '1. Mathematical Formulation' },
            { id: 'indicators', label: '2. 7 Integrated Indicators & Weights' },
            { id: 'riskRules', label: '3. Dual-Vector At-Risk Logic' },
            { id: 'explainability', label: '4. Explainable Score Attribution' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-sky-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* TAB 1: Mathematical Formulation */}
          {activeTab === 'formulation' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Why Traditional Single-Metric (CGPA-Only) Tracking Fails
                </h3>
                <p className="mt-1 text-slate-600 text-xs sm:text-sm">
                  Colleges generate massive data streams across attendance registers, learning management systems, test portals, and campus clubs, yet they are rarely united. Relying solely on CGPA creates a fatal blind spot: students with high marks who cannot clear placement coding interviews, or gifted coders disqualified by attendance regulations.
                </p>
              </div>

              {/* Equation Box */}
              <div className="bg-sky-950 text-white rounded-xl p-5 border border-sky-800 space-y-3 font-mono text-xs">
                <div className="text-sky-300 font-bold uppercase text-[10px] tracking-widest">
                  The Unified Student Success Score Equation
                </div>
                <div className="text-sm sm:text-base font-semibold text-emerald-400 overflow-x-auto py-1">
                  Success Score (S) = Clamp_0^100 [ P_Acad + P_Attn + P_Place + P_LMS + P_Engage - Penalties ]
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed pt-2 border-t border-sky-800">
                  Where:
                  <ul className="list-disc list-inside space-y-1 mt-1 text-slate-400">
                    <li><strong className="text-slate-200">P_Acad (30 pts max):</strong> (CGPA / 10 * 18) + (ExamAvg / 100 * 12) - (8 * Backlogs)</li>
                    <li><strong className="text-slate-200">P_Attn (20 pts max):</strong> Scaled non-linear sigmoid around statutory 75% baseline ± Trend</li>
                    <li><strong className="text-slate-200">P_Place (25 pts max):</strong> Coding (10 pts) + Aptitude (7 pts) + Mock Interview (5 pts) + Soft Skills (3 pts)</li>
                    <li><strong className="text-slate-200">P_LMS (15 pts max):</strong> On-time submissions (9.5 pts) + Login regularity (3.5 pts) - Inactivity penalties</li>
                    <li><strong className="text-slate-200">P_Engage (10 pts max):</strong> Hackathons/Certs (5 pts) + Faculty rating (3 pts) + Satisfaction (2 pts)</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                  <div className="font-bold text-slate-900 mb-1">Standardized Normalization</div>
                  <p className="text-slate-600">
                    All continuous signals (0–10 scale, percentage marks, 1–5 qualitative rubrics) are normalized to unit vectors before weighted synthesis to avoid domain scale skewing.
                  </p>
                </div>

                <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                  <div className="font-bold text-slate-900 mb-1">Leading vs. Lagging Indicators</div>
                  <p className="text-slate-600">
                    LMS inactivity and attendance drops serve as 14-day <em>leading indicators</em> that warn faculty advisors before exam grades or backlogs (<em>lagging indicators</em>) materialize.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Indicators & Weights */}
          {activeTab === 'indicators' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                The 7 Integrated Data Streams & Parameter Weights
              </h3>

              <div className="border border-sky-100 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-sky-50/70 uppercase text-[10px] font-bold text-sky-900 border-b border-sky-100">
                    <tr>
                      <th className="py-2.5 px-4">Pillar</th>
                      <th className="py-2.5 px-4">Data Source Streams</th>
                      <th className="py-2.5 px-4 text-right">Max Weight</th>
                      <th className="py-2.5 px-4">Intervention Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100/60">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">1. Academic Mastery</td>
                      <td className="py-3 px-4 text-slate-600">CGPA, Internal exams, Backlog count</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-600">30 Pts</td>
                      <td className="py-3 px-4 text-slate-600">Department tutoring, remedial lectures</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">2. Attendance & Presence</td>
                      <td className="py-3 px-4 text-slate-600">Overall %, Theory vs Lab %, Streak trend</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-600">20 Pts</td>
                      <td className="py-3 px-4 text-slate-600">Guardian SMS alerts, condonation prevention</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">3. Placement Readiness</td>
                      <td className="py-3 px-4 text-slate-600">Coding tests, Aptitude, Mock interviews</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-600">25 Pts</td>
                      <td className="py-3 px-4 text-slate-600">Competitive programming bootcamps</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">4. LMS Engagement</td>
                      <td className="py-3 px-4 text-slate-600">Assignment completion, Weekly logins, Inactivity</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-600">15 Pts</td>
                      <td className="py-3 px-4 text-slate-600">Early disengagement detection</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">5. Extracurricular & Feedback</td>
                      <td className="py-3 px-4 text-slate-600">Hackathons, Certifications, Faculty sentiment</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-600">10 Pts</td>
                      <td className="py-3 px-4 text-slate-600">Holistic development & prestige fellowships</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Dual-Vector Risk Logic */}
          {activeTab === 'riskRules' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-slate-900">
                Dual-Vector At-Risk Identification Protocol
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Academic Risk */}
                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-rose-900 uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Vector A: Academic Performance Risk</span>
                  </div>
                  <p className="text-slate-700">
                    A student is flagged for Academic Risk if any of the following triggers are met:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-rose-900">
                    <li>CGPA &lt; 6.5 / 10.0</li>
                    <li>Active Backlogs &gt; 0</li>
                    <li>Attendance &lt; 75% (Statutory Condonation Limit)</li>
                    <li>LMS Assignment Completion &lt; 60%</li>
                  </ul>
                  <div className="text-[11px] text-slate-600 pt-2 border-t border-rose-200">
                    <strong>Action:</strong> Routed to Department Academic Remedial Cell & Assigned Peer Tutor.
                  </div>
                </div>

                {/* Placement Risk */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Vector B: Placement Outcome Risk</span>
                  </div>
                  <p className="text-slate-700">
                    A student is flagged for Placement Outcome Risk even with a passing CGPA if:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-amber-900">
                    <li>Timed Coding Assessment &lt; 55%</li>
                    <li>Quantitative Aptitude Test &lt; 55%</li>
                    <li>Panel Mock Interview Rating &lt; 2.8 / 5.0</li>
                    <li>Resume Readiness Index &lt; 55%</li>
                  </ul>
                  <div className="text-[11px] text-slate-600 pt-2 border-t border-amber-200">
                    <strong>Action:</strong> Routed to Placement Cell for Algorithmic Sprint & Mock Clinics.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Explainability */}
          {activeTab === 'explainability' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">
                Explainable Score Attribution: Eliminating AI Black Boxes
              </h3>
              <p className="text-slate-600">
                Judges and administrators must know <em>why</em> a student received a score of 54 versus 88. Our platform applies a SHAP-inspired game-theoretic attribution mechanism comparing the student's normalized indicators against cohort baselines:
              </p>

              <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 space-y-3 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">
                  Attribution Formula for Indicator (i):
                </div>
                <div className="text-sky-700 font-semibold">
                  Delta_i = w_i * [ Norm(Value_i) - Norm(CohortMean_i) ]
                </div>
                <p className="text-slate-600 font-sans text-xs">
                  - If Δi &gt; 0: Positive driver (+pts added to score).<br/>
                  - If Δi &lt; 0: Negative drag (-pts subtracted due to deficit or statutory penalties).
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <span className="font-bold">Transparent Accountability:</span> Faculty advisors can walk students through their exact positive drivers and negative drags during 1-on-1 counseling, transforming data into empathetic, actionable mentorship.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-colors active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
