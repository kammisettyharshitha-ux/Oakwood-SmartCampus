import React, { useState, useEffect } from 'react';
import { initialStudents, initialInterventions } from './data/studentsData';
import { StudentRecord, InterventionItem } from './types/student';
import { FacultyUser } from './types/auth';
import { getActiveFacultySession, logoutFacultySession } from './data/facultyAccounts';
import { Header, ActiveTab } from './components/Header';
import { FacultyAuthPage } from './components/FacultyAuthPage';
import { OverviewView } from './components/OverviewView';
import { StudentRosterView } from './components/StudentRosterView';
import { CohortSegmentsView } from './components/CohortSegmentsView';
import { InterventionCenterView } from './components/InterventionCenterView';
import { Student360Modal } from './components/Student360Modal';
import { AddStudentModal } from './components/AddStudentModal';
import { CreateInterventionModal } from './components/CreateInterventionModal';
import { ScoringMethodologyModal } from './components/ScoringMethodologyModal';
import { PresentationDeckModal } from './components/PresentationDeckModal';
import { DataIngestionModal } from './components/DataIngestionModal';

const STORAGE_KEY_STUDENTS = 'smartcampus_students_data';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<FacultyUser | null>(() => getActiveFacultySession());

  // Platform Data States (with localStorage persistence)
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored students:', e);
    }
    return initialStudents;
  });

  const [interventions, setInterventions] = useState<InterventionItem[]>(initialInterventions);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal States
  const [selectedStudentFor360, setSelectedStudentFor360] = useState<StudentRecord | null>(null);
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<StudentRecord | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showCreateInterventionModal, setShowCreateInterventionModal] = useState<boolean>(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);
  const [showPresentationModal, setShowPresentationModal] = useState<boolean>(false);
  const [showDataIngestionModal, setShowDataIngestionModal] = useState<boolean>(false);

  // Sync students to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students to storage:', e);
    }
  }, [students]);

  // Sign out handler
  const handleSignOut = () => {
    logoutFacultySession();
    setCurrentUser(null);
  };

  // Handlers
  const handleSelectStudent = (student: StudentRecord) => {
    setSelectedStudentFor360(student);
  };

  const handleSelectStudentByRoll = (rollNo: string) => {
    const found = students.find((s) => s.rollNo === rollNo);
    if (found) {
      setSelectedStudentFor360(found);
    }
  };

  const handleOpenCreateIntervention = (student?: StudentRecord) => {
    setSelectedStudentForIntervention(student || null);
    setShowCreateInterventionModal(true);
  };

  const handleCreateIntervention = (item: Omit<InterventionItem, 'id' | 'createdAt'>) => {
    const newItem: InterventionItem = {
      ...item,
      id: `int-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setInterventions([newItem, ...interventions]);
  };

  const handleUpdateInterventionStatus = (id: string, newStatus: InterventionItem['status']) => {
    setInterventions(
      interventions.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Student Add handler: prepends newly added student and opens their 360 profile
  const handleAddStudent = (newStudent: StudentRecord) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    setSelectedStudentFor360(newStudent);
  };

  const atRiskCount = students.filter((s) => s.isAcademicRisk || s.isPlacementRisk).length;
  const activeInterventionsCount = interventions.filter((i) => i.status === 'In Progress' || i.status === 'Pending').length;

  // If faculty is not logged in, show the front page login/registration gateway
  if (!currentUser) {
    return <FacultyAuthPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Once authenticated, render the full Smart Campus Analytics interface
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-slate-50 to-sky-50/40 flex flex-col font-sans text-slate-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddStudent={() => setShowAddStudentModal(true)}
        onOpenMethodology={() => setShowMethodologyModal(true)}
        onOpenSlides={() => setShowPresentationModal(true)}
        atRiskCount={atRiskCount}
        activeInterventionsCount={activeInterventionsCount}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <OverviewView
            students={students}
            interventions={interventions}
            onSelectStudent={handleSelectStudent}
            onNavigateToRoster={() => setActiveTab('roster')}
            onNavigateToSegments={() => setActiveTab('segments')}
            onNavigateToInterventions={() => setActiveTab('interventions')}
            onOpenMethodology={() => setShowMethodologyModal(true)}
            onOpenAddStudent={() => setShowAddStudentModal(true)}
          />
        )}

        {activeTab === 'roster' && (
          <StudentRosterView
            students={students}
            onSelectStudent={handleSelectStudent}
            onOpenCreateIntervention={(student) => handleOpenCreateIntervention(student)}
            onOpenAddStudent={() => setShowAddStudentModal(true)}
          />
        )}

        {activeTab === 'segments' && (
          <CohortSegmentsView
            students={students}
            onSelectStudent={handleSelectStudent}
            onOpenCreateIntervention={(student) => handleOpenCreateIntervention(student)}
          />
        )}

        {activeTab === 'interventions' && (
          <InterventionCenterView
            interventions={interventions}
            students={students}
            onUpdateStatus={handleUpdateInterventionStatus}
            onOpenCreateModal={() => handleOpenCreateIntervention()}
            onSelectStudentByRoll={handleSelectStudentByRoll}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-white/90 backdrop-blur-sm py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Oakwood SmartCampus Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Signed in as {currentUser.name} ({currentUser.department})</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button 
              onClick={() => setShowMethodologyModal(true)}
              className="hover:text-slate-600 transition-colors"
            >
              Scoring Methodology
            </button>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setShowPresentationModal(true)}
              className="hover:text-slate-600 transition-colors"
            >
              Presentation Slides
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleSignOut}
              className="hover:text-rose-600 transition-colors text-slate-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedStudentFor360 && (
        <Student360Modal
          student={selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
          onCreateIntervention={(s) => handleOpenCreateIntervention(s)}
        />
      )}

      {showAddStudentModal && (
        <AddStudentModal
          onClose={() => setShowAddStudentModal(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {showCreateInterventionModal && (
        <CreateInterventionModal
          students={students}
          initialStudent={selectedStudentForIntervention}
          onClose={() => {
            setShowCreateInterventionModal(false);
            setSelectedStudentForIntervention(null);
          }}
          onSubmit={handleCreateIntervention}
        />
      )}

      {showMethodologyModal && (
        <ScoringMethodologyModal
          onClose={() => setShowMethodologyModal(false)}
        />
      )}

      {showPresentationModal && (
        <PresentationDeckModal
          onClose={() => setShowPresentationModal(false)}
          onExplorePrototype={() => {
            setShowPresentationModal(false);
            setActiveTab('overview');
          }}
        />
      )}

      {showDataIngestionModal && (
        <DataIngestionModal
          onClose={() => setShowDataIngestionModal(false)}
          onAddStudent={handleAddStudent}
          onResetCohort={() => {
            setStudents(initialStudents);
            localStorage.removeItem(STORAGE_KEY_STUDENTS);
          }}
          studentCount={students.length}
        />
      )}
    </div>
  );
}
