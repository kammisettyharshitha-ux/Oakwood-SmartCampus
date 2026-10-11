import React, { useState } from 'react';
import { FacultyUser } from '../types/auth';
import { 
  registerFacultyAccount, 
  loginFacultyAccount, 
  SEED_FACULTY_ACCOUNTS 
} from '../data/facultyAccounts';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Sparkles,
  School,
  Check,
  ChevronRight
} from 'lucide-react';

const CAMPUS_IMG = '/src/assets/images/campus_quad_aerial_1791651850196.jpg';

interface FacultyAuthPageProps {
  onLoginSuccess: (user: FacultyUser) => void;
}

export const FacultyAuthPage: React.FC<FacultyAuthPageProps> = ({ onLoginSuccess }) => {
  // Faculty auth step mode: user requested registration first, then login
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regDesignation, setRegDesignation] = useState('Associate Professor & Academic Mentor');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status & Notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your institutional email address and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginFacultyAccount(loginEmail, loginPassword);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 350);
  };

  // Handle Register (Step 1)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please provide your name, institutional email address, and password.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMessage('Please provide a valid institutional email address (e.g. name@oakwood.edu).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerFacultyAccount({
        name: regName,
        email: regEmail,
        password: regPassword,
        department: regDepartment,
        designation: regDesignation,
      });

      setLoading(false);
      if (res.success && res.user) {
        // Transition to login screen with success message and pre-filled email
        setSuccessMessage(`Account registered successfully for ${regName}! Please enter your password below to log in.`);
        setLoginEmail(regEmail);
        setLoginPassword('');
        setMode('login');
      } else {
        setErrorMessage(res.error || 'Registration failed. Email may already be registered.');
      }
    }, 450);
  };

  // Quick Demo Login Handler for convenience
  const handleQuickDemoLogin = (email: string, pass: string) => {
    setErrorMessage(null);
    const res = loginFacultyAccount(email, pass);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Sky-Blue Elements & Campus Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={CAMPUS_IMG}
          alt="University Campus Aerial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-15 filter blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-sky-100/90" />
        {/* Soft Ambient Sky Blue Glowing Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
      </div>

      {/* Main Container Card - Realistic, Attractive Sky Blue Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-sky-900/10 border border-sky-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Column: Collegiate Sky-Blue Brand Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-800 via-sky-700 to-sky-900 p-6 sm:p-8 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-sky-600/30 relative overflow-hidden">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10">
            {/* Header / Brand Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-md shadow-sky-950/20">
                <GraduationCap className="w-6 h-6 text-sky-200" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
                  Oakwood SmartCampus
                </h1>
                <p className="text-[11px] text-sky-200 font-medium tracking-wide">
                  Student Success & Analytics Platform
                </p>
              </div>
            </div>

            {/* Pillar Information */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-sky-300/30 rounded-full text-[11px] font-semibold text-sky-100 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Faculty & Administrator Gateway</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug" style={{ textWrap: 'balance' }}>
                Predict, Optimize & Improve Student Success
              </h2>

              <p className="text-sky-100 text-xs sm:text-sm leading-relaxed">
                Connect campus data across 7 silos—academics, attendance, LMS, placement assessments, and faculty mentoring—to identify at-risk students proactively.
              </p>
            </div>

            {/* Flow indicator: Register -> Login -> Interface */}
            <div className="mt-6 p-3.5 rounded-xl bg-sky-900/50 border border-sky-400/20 space-y-2 text-xs">
              <div className="text-[11px] uppercase tracking-wider text-sky-300 font-semibold flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                <span>Faculty Access Procedure</span>
              </div>
              <div className="flex items-center gap-2 text-sky-100">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${mode === 'register' ? 'bg-sky-400 text-sky-950' : 'bg-sky-600 text-white'}`}>
                  1
                </span>
                <span className={mode === 'register' ? 'font-semibold text-white' : 'opacity-80'}>
                  Register Faculty Profile
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${mode === 'login' ? 'bg-sky-400 text-sky-950' : 'bg-sky-600 text-white'}`}>
                  2
                </span>
                <span className={mode === 'login' ? 'font-semibold text-white' : 'opacity-80'}>
                  Log In
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Trust Badges */}
          <div className="relative z-10 mt-8 pt-5 border-t border-sky-600/40 space-y-2.5 text-xs text-sky-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-300 shrink-0" />
              <span>FERPA-Compliant Institutional Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Real-Time Student Success Score Engine</span>
            </div>
            <div className="text-[11px] text-sky-300/80 pt-1 font-mono">
              Academic Year 2026 · Campus Decision Intelligence
            </div>
          </div>
        </div>

        {/* Right Column: Register & Login Forms (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Mode Switcher Tabs: Sky Blue Realistic Tabs */}
            <div className="flex items-center p-1 bg-sky-50 rounded-xl border border-sky-100 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-sky-700 shadow-sm border border-sky-200'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                <User className="w-3.5 h-3.5 text-sky-500" />
                <span>1. Register Faculty Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-sky-700 shadow-sm border border-sky-200'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-sky-500" />
                <span>2. Faculty Log In</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2.5 text-xs text-sky-800 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 1: FACULTY REGISTRATION FORM                         */}
            {/* ======================================================== */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-0.5">Faculty Registration</h3>
                  <p className="text-slate-500 text-[11px] mb-3">
                    Register with your name, institutional email address, and secure password to activate your access.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Faculty Full Name (with Title)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Khanna"
                      className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. r.khanna@oakwood.edu"
                      className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Academic Department
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Eng</option>
                        <option value="Data Science & Analytics">Data Science & Analytics</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Electronics & Communication">Electronics & Comm</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Academic Designation / Role
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        placeholder="e.g. Associate Professor"
                        className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-slate-600 text-[11px] cursor-pointer">
                    <input type="checkbox" required defaultChecked className="mt-0.5 rounded border-sky-300 text-sky-600 focus:ring-sky-500" />
                    <span>I confirm my faculty affiliation with Oakwood University and agree to academic data governance standards.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>Registering Faculty Credentials...</span>
                  ) : (
                    <>
                      <span>Register Account & Proceed to Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2 text-slate-500 text-[11px]">
                  Already have a registered account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Click here to Log In
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 2: FACULTY LOGIN FORM                                */}
            {/* ======================================================== */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-0.5">Faculty Sign In</h3>
                  <p className="text-slate-500 text-[11px] mb-3">
                    Sign in with your registered email address and password to enter the Smart Campus analytics interface.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. sarah.jenkins@oakwood.edu"
                      className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Password
                    </label>
                    <span 
                      onClick={() => {
                        setErrorMessage('Please contact campus IT at it-support@oakwood.edu or use one-click demo credentials below.');
                      }}
                      className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-sky-50/30 text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded border-sky-300 text-sky-600 focus:ring-sky-500" />
                    <span>Keep me logged in on this browser</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Log In to Faculty Interface</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2 text-slate-500 text-[11px]">
                  New faculty member?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Register your details first
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick One-Click Faculty Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-sky-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>One-Click Faculty Demo Credentials</span>
              </div>
              <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-mono">
                Pre-configured
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(SEED_FACULTY_ACCOUNTS[0].email, 'academic2026')}
                className="p-2.5 text-left bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/80 rounded-xl transition-all group shadow-xs"
              >
                <div className="font-semibold text-slate-800 group-hover:text-sky-700 flex items-center justify-between">
                  <span>Dr. Sarah Jenkins</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500">Dean of Academic Affairs</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(SEED_FACULTY_ACCOUNTS[1].email, 'placement2026')}
                className="p-2.5 text-left bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/80 rounded-xl transition-all group shadow-xs"
              >
                <div className="font-semibold text-slate-800 group-hover:text-sky-700 flex items-center justify-between">
                  <span>Prof. K. Raman</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500">Director, Placement Cell</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
