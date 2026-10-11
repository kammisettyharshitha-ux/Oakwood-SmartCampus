import React, { useState } from 'react';
import { StudentRecord, InterventionItem } from '../types/student';
import { X, CheckSquare, Plus } from 'lucide-react';

interface CreateInterventionModalProps {
  students: StudentRecord[];
  initialStudent?: StudentRecord | null;
  onClose: () => void;
  onSubmit: (item: Omit<InterventionItem, 'id' | 'createdAt'>) => void;
}

export const CreateInterventionModal: React.FC<CreateInterventionModalProps> = ({
  students,
  initialStudent,
  onClose,
  onSubmit,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent ? initialStudent.id : students[0]?.id || ''
  );
  const [category, setCategory] = useState<InterventionItem['category']>('Placement Bootcamp');
  const [priority, setPriority] = useState<InterventionItem['priority']>('High');
  const [assignedTo, setAssignedTo] = useState<string>('Prof. K. Raman (Placement Cell)');
  const [targetMetric, setTargetMetric] = useState<string>('Coding test score from current level to >70%');
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().slice(0, 10);
  });
  const [actionNote, setActionNote] = useState<string>(
    'Enrolled in mandatory 3-week algorithmic problem solving clinic with weekly mentor progress checkpoints.'
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    onSubmit({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      rollNo: selectedStudent.rollNo,
      department: selectedStudent.department,
      category,
      priority,
      assignedTo,
      targetMetric,
      dueDate,
      status: 'In Progress',
      actionNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-sky-100 shadow-2xl w-full max-w-lg overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-sky-100 bg-sky-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Schedule Remedial Intervention
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Student Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) — {s.department} (Score: {s.successScore})
                </option>
              ))}
            </select>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Intervention Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
              >
                <option value="Placement Bootcamp">Placement Bootcamp</option>
                <option value="Academic Tutoring">Academic Tutoring</option>
                <option value="Attendance Counseling">Attendance Counseling</option>
                <option value="Mental Health & Mentor">Mental Health & Mentor</option>
                <option value="Coding Drill">Coding Drill</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
              >
                <option value="Immediate">Immediate (Emergency)</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Assigned Faculty Owner */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty / Mentor</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
              placeholder="e.g. Dr. S. Mukherjee (HOD CS)"
              required
            />
          </div>

          {/* Target Metric */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Measurable Metric</label>
            <input
              type="text"
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
              placeholder="e.g. Attendance recovery to >75% within 3 weeks"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Milestone Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-800"
              required
            />
          </div>

          {/* Action Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Action Description & Protocol Notes</label>
            <textarea
              rows={3}
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg bg-sky-50/30 focus:outline-none focus:ring-2 focus:ring-sky-500/20 leading-relaxed text-slate-800"
              required
            />
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
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 font-semibold shadow-sm shadow-sky-600/20 active:scale-95"
            >
              Confirm & Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
