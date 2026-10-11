import React, { useState } from 'react';
import { InterventionItem, StudentRecord } from '../types/student';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Briefcase, 
  BookOpen, 
  HeartHandshake
} from 'lucide-react';

interface InterventionCenterViewProps {
  interventions: InterventionItem[];
  students: StudentRecord[];
  onUpdateStatus: (id: string, newStatus: InterventionItem['status']) => void;
  onOpenCreateModal: () => void;
  onSelectStudentByRoll: (rollNo: string) => void;
}

export const InterventionCenterView: React.FC<InterventionCenterViewProps> = ({
  interventions,
  students,
  onUpdateStatus,
  onOpenCreateModal,
  onSelectStudentByRoll,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | InterventionItem['status']>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredInterventions = interventions.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    return true;
  });

  const resolvedCount = interventions.filter((i) => i.status === 'Resolved').length;
  const inProgressCount = interventions.filter((i) => i.status === 'In Progress').length;
  const pendingCount = interventions.filter((i) => i.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Remedial Intervention & Action Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking dean, faculty advisor, and placement cell interventions to close student risk gaps before end-of-semester assessments.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-md shadow-sky-600/20 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Remedial Intervention</span>
        </button>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-sky-100 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total Interventions Tracked</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
            {interventions.length}
          </div>
          <div className="text-xs text-sky-600 font-medium mt-0.5">Across all risk categories</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-sky-100 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Active In-Progress</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 mt-1">
            {inProgressCount}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Remedial sessions underway</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-sky-100 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Pending Assignment</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
            {pendingCount}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Awaiting advisor scheduling</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-sky-100 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Successfully Resolved</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mt-1">
            {resolvedCount}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-0.5">Risk flags cleared</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-500 font-medium shrink-0">Status:</span>
          {(['All', 'Pending', 'In Progress', 'Under Review', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-sky-100 text-sky-800 font-semibold border border-sky-300'
                  : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-3 text-xs border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-sky-50/30 text-slate-700 font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Academic Tutoring">Academic Tutoring</option>
            <option value="Placement Bootcamp">Placement Bootcamp</option>
            <option value="Attendance Counseling">Attendance Counseling</option>
            <option value="Mental Health & Mentor">Mental Health & Mentor</option>
            <option value="Coding Drill">Coding Drill</option>
          </select>
        </div>
      </div>

      {/* Interventions List / Cards */}
      <div className="space-y-3">
        {filteredInterventions.length === 0 ? (
          <div className="bg-white rounded-xl border border-sky-100 p-12 text-center text-slate-500 text-xs">
            No interventions match the selected status or category filters.
          </div>
        ) : (
          filteredInterventions.map((item) => {
            let categoryIcon = <CheckSquare className="w-4 h-4 text-sky-600" />;
            if (item.category === 'Academic Tutoring') categoryIcon = <BookOpen className="w-4 h-4 text-sky-600" />;
            else if (item.category === 'Placement Bootcamp' || item.category === 'Coding Drill') categoryIcon = <Briefcase className="w-4 h-4 text-amber-600" />;
            else if (item.category === 'Mental Health & Mentor' || item.category === 'Attendance Counseling') categoryIcon = <HeartHandshake className="w-4 h-4 text-rose-600" />;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-sky-100 shadow-2xs p-5 hover:border-sky-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {categoryIcon}
                      <span>{item.category}</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <button
                      onClick={() => onSelectStudentByRoll(item.rollNo)}
                      className="text-xs font-bold text-sky-600 hover:underline"
                    >
                      {item.studentName} ({item.rollNo})
                    </button>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{item.department}</span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[11px] font-semibold font-mono ${
                      item.priority === 'Immediate' ? 'text-rose-600' : item.priority === 'High' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {item.actionNote}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-4 flex-wrap">
                    <span><strong>Target Metric:</strong> {item.targetMetric}</span>
                    <span><strong>Assigned:</strong> {item.assignedTo}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-sky-500" />
                      <span>Due {item.dueDate}</span>
                    </span>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                    className={`text-xs font-semibold py-1.5 px-3 rounded-lg border focus:outline-none transition-colors ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.status === 'In Progress'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : item.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="Pending">Status: Pending</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Under Review">Status: Under Review</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
