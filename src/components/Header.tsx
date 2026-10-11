import React from 'react';
import { 
  BarChart3, 
  Users, 
  PieChart, 
  CheckSquare, 
  FileText, 
  Presentation, 
  UserPlus,
  GraduationCap,
  LogOut,
  Sparkles
} from 'lucide-react';
import { FacultyUser } from '../types/auth';

export type ActiveTab = 'overview' | 'roster' | 'segments' | 'interventions' | 'methodology' | 'slides';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenMethodology: () => void;
  onOpenSlides: () => void;
  atRiskCount: number;
  activeInterventionsCount: number;
  currentUser: FacultyUser | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenMethodology,
  onOpenSlides,
  atRiskCount,
  activeInterventionsCount,
  currentUser,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs shadow-sky-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Zone 1: Single Brand Wordmark & Collegiate Icon */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <a 
              href="#overview" 
              onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
              className="flex flex-col text-left group"
            >
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors whitespace-nowrap">
                SmartCampus Analytics
              </span>
              <span className="text-[10px] font-medium text-sky-600 tracking-wide -mt-0.5">
                Decision Intelligence Platform
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (single-line links with Sky Blue active highlight) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-sky-50 text-sky-800 font-semibold ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Campus Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'roster'
                  ? 'bg-sky-50 text-sky-800 font-semibold ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/50'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Student 360 Roster</span>
              {atRiskCount > 0 && (
                <span className="text-[11px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-mono tabular-nums font-semibold">
                  {atRiskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('segments')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'segments'
                  ? 'bg-sky-50 text-sky-800 font-semibold ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/50'
              }`}
            >
              <PieChart className="w-4 h-4 text-sky-600" />
              <span>Cohort Segments</span>
            </button>

            <button
              onClick={() => setActiveTab('interventions')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'interventions'
                  ? 'bg-sky-50 text-sky-800 font-semibold ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-sky-600" />
              <span>Intervention Center</span>
              {activeInterventionsCount > 0 && (
                <span className="text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono tabular-nums font-semibold">
                  {activeInterventionsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenMethodology}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Methodology Note explaining indicators & formulation"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Scoring Logic</span>
            </button>

            <button
              onClick={onOpenSlides}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Executive Presentation Slides"
            >
              <Presentation className="w-4 h-4 text-sky-600" />
              <span>Executive Deck</span>
            </button>
          </nav>

          {/* Zone 3: Add Student Primary Action & Faculty Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent Sky Blue + Add Student Button */}
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 rounded-lg hover:from-sky-500 hover:to-sky-400 shadow-sm shadow-sky-500/25 ring-1 ring-sky-400/40 transition-all whitespace-nowrap shrink-0 active:scale-95"
              title="Add a new student and calculate risk score across all 7 data streams"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student</span>
            </button>

            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-sky-100">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-sky-200 ring-2 ring-sky-100 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0 border border-sky-200">
                    {currentUser.name.charAt(0)}
                  </div>
                )}

                <div className="hidden xl:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-900 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-sky-600 truncate max-w-[130px] font-medium">
                    {currentUser.designation}
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  title="Sign Out of Faculty Portal"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
