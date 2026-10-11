import React, { useState, useMemo } from 'react';
import { StudentRecord, StudentSegment } from '../types/student';
import { 
  Search, 
  Download, 
  ArrowUpDown, 
  Eye, 
  CheckCircle2, 
  UserPlus,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

interface StudentRosterViewProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onOpenCreateIntervention: (student: StudentRecord) => void;
  onOpenAddStudent: () => void;
}

export const StudentRosterView: React.FC<StudentRosterViewProps> = ({
  students,
  onSelectStudent,
  onOpenCreateIntervention,
  onOpenAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'academic' | 'placement' | 'dual' | 'safe'>('All');
  const [sortField, setSortField] = useState<'successScore' | 'cgpa' | 'attendance' | 'codingScore' | 'backlogs'>('successScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Sort
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch = s.name.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query);
        if (!matchesSearch) return false;

        // Department
        if (selectedDepartment !== 'All' && s.department !== selectedDepartment) return false;

        // Segment
        if (selectedSegment !== 'All' && s.segment !== selectedSegment) return false;

        // Risk Filter
        if (selectedRiskFilter === 'academic' && !s.isAcademicRisk) return false;
        if (selectedRiskFilter === 'placement' && !s.isPlacementRisk) return false;
        if (selectedRiskFilter === 'dual' && !(s.isAcademicRisk && s.isPlacementRisk)) return false;
        if (selectedRiskFilter === 'safe' && (s.isAcademicRisk || s.isPlacementRisk)) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [students, searchQuery, selectedDepartment, selectedSegment, selectedRiskFilter, sortField, sortOrder]);

  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'Name',
      'Department',
      'Semester',
      'Success Score',
      'Status',
      'CGPA',
      'Backlogs',
      'Attendance %',
      'LMS Completion %',
      'LMS Weekly Logins',
      'Aptitude Score',
      'Coding Score',
      'Mock Interview',
      'Soft Skills',
      'Academic Risk',
      'Placement Risk',
      'Segment',
    ];

    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.department}"`,
      s.semester,
      s.successScore,
      `"${s.status}"`,
      s.cgpa,
      s.backlogs,
      s.attendance,
      s.lmsCompletion,
      s.lmsLogins,
      s.aptitudeScore,
      s.codingScore,
      s.mockInterviewRating,
      s.softSkillsScore,
      s.isAcademicRisk ? 'YES' : 'NO',
      s.isPlacementRisk ? 'YES' : 'NO',
      `"${s.segment}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCampus_Student_Success_Cohort_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departments = ['All', 'Computer Science', 'Data Science', 'AI & ML', 'Electronics & Comm', 'Information Tech', 'Mechanical'];
  const segments = [
    'All',
    'High Academic, Low Placement',
    'Practical Prodigy, Academic Risk',
    'Disengaged Attrition Vector',
    'Multi-Risk Critical',
    'Flourishing All-Rounder',
    'Steady Core Contributor',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student 360 Analytics Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Integrated multi-source repository: Academic, Attendance, LMS, Placement, Skills, and Faculty Feedback
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Prominent Sky Blue Add Student Button */}
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-lg shadow-md shadow-sky-600/20 ring-1 ring-sky-400/30 transition-all whitespace-nowrap active:scale-95"
            title="Add a new student and evaluate multi-stream success score"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student Details</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800 font-medium"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  Department: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Segment Filter */}
          <div>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800 font-medium"
            >
              {segments.map((seg) => (
                <option key={seg} value={seg}>
                  Segment: {seg}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="flex-1 py-2 px-3 text-xs border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800 font-medium"
            >
              <option value="successScore">Sort by: Success Score</option>
              <option value="cgpa">Sort by: CGPA</option>
              <option value="attendance">Sort by: Attendance</option>
              <option value="codingScore">Sort by: Coding Score</option>
              <option value="backlogs">Sort by: Active Backlogs</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-sky-200 rounded-lg hover:bg-sky-50 text-sky-700"
              title={`Switch to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Risk State Quick Selector Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-sky-100 overflow-x-auto text-xs">
          <span className="text-slate-500 font-medium shrink-0">Filter By Risk:</span>
          {[
            { id: 'All', label: 'All Students' },
            { id: 'academic', label: 'Academic Risk' },
            { id: 'placement', label: 'Placement Risk' },
            { id: 'dual', label: 'Dual Multi-Risk' },
            { id: 'safe', label: 'Flourishing / On Track' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRiskFilter(tab.id as any)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedRiskFilter === tab.id
                  ? 'bg-sky-100 text-sky-800 font-semibold border border-sky-300'
                  : 'text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto text-xs text-slate-500 font-mono tabular-nums shrink-0">
            Showing {filteredStudents.length} of {students.length}
          </div>
        </div>
      </div>

      {/* High-Density Data Grid Table - Sky Blue Themed */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-50/70 text-[11px] uppercase tracking-wider font-semibold text-sky-900 border-b border-sky-100">
              <tr>
                <th className="py-3 px-6">Student & Roll No</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Success Score</th>
                <th className="py-3 px-4 text-right">CGPA / Backlogs</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-right">LMS Completion</th>
                <th className="py-3 px-4 text-right">Placement Prep</th>
                <th className="py-3 px-4">Segment / Flags</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    <div className="space-y-2">
                      <p>No student records matched the active filter criteria.</p>
                      <button
                        onClick={onOpenAddStudent}
                        className="px-3.5 py-1.5 bg-sky-600 text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add New Student</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  let statusColor = 'text-slate-900';
                  if (student.status === 'Flourishing') statusColor = 'text-emerald-600';
                  else if (student.status === 'Steady') statusColor = 'text-sky-600';
                  else if (student.status === 'Needs Monitoring') statusColor = 'text-amber-600';
                  else if (student.status === 'Critical Risk') statusColor = 'text-rose-600';

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-sky-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Name & Roll */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-sky-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono tabular-nums">
                              {student.rollNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div>{student.department}</div>
                        <div className="text-slate-400 font-mono tabular-nums">Sem {student.semester}</div>
                      </td>

                      {/* Success Score */}
                      <td className="py-3 px-4 text-right">
                        <div className={`font-mono tabular-nums font-bold text-base ${statusColor}`}>
                          {student.successScore}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {student.status}
                        </div>
                      </td>

                      {/* Academic */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs">
                        <div className="font-semibold text-slate-900">{student.cgpa.toFixed(2)}</div>
                        {student.backlogs > 0 ? (
                          <div className="text-rose-600 font-semibold">
                            {student.backlogs} backlog{student.backlogs > 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="text-emerald-700 text-[11px]">Clean</div>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs">
                        <div className={student.attendance < 75 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                          {student.attendance}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Lab: {student.labAttendance}%
                        </div>
                      </td>

                      {/* LMS */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs">
                        <div className={student.lmsCompletion < 60 ? 'text-rose-600 font-semibold' : 'text-slate-900'}>
                          {student.lmsCompletion}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {student.lmsLogins} logins/wk
                        </div>
                      </td>

                      {/* Placement Prep */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs">
                        <div className={student.codingScore < 50 ? 'text-amber-600 font-bold' : 'text-slate-900'}>
                          Code: {student.codingScore}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Apt: {student.aptitudeScore}% · Mock: {student.mockInterviewRating}/5
                        </div>
                      </td>

                      {/* Segment & Flags */}
                      <td className="py-3 px-4 text-xs">
                        <div className="font-semibold text-slate-800">
                          {student.segment}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {student.isAcademicRisk && <span className="text-rose-600 font-semibold">Acad Risk</span>}
                          {student.isAcademicRisk && student.isPlacementRisk && <span>·</span>}
                          {student.isPlacementRisk && <span className="text-amber-600 font-semibold">Place Risk</span>}
                          {!student.isAcademicRisk && !student.isPlacementRisk && (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Safe
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="View 360 Student Analytics Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenCreateIntervention(student)}
                            className="px-2.5 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors whitespace-nowrap border border-sky-200"
                          >
                            Intervene
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
