import { FacultyUser, StoredFacultyAccount } from '../types/auth';

const FACULTY_AVATAR = '/src/assets/images/avatar_faculty_advisor_1791651886979.jpg';

export const SEED_FACULTY_ACCOUNTS: StoredFacultyAccount[] = [
  {
    id: 'fac-01',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@oakwood.edu',
    department: 'Academic Affairs & Research',
    designation: 'Dean of Academic Affairs',
    avatarUrl: FACULTY_AVATAR,
    createdAt: '2026-01-15',
    passwordHash: 'academic2026',
  },
  {
    id: 'fac-02',
    name: 'Prof. K. Raman',
    email: 'k.raman@oakwood.edu',
    department: 'Career & Placement Division',
    designation: 'Director of Corporate Placement Cell',
    avatarUrl: undefined,
    createdAt: '2026-02-10',
    passwordHash: 'placement2026',
  },
  {
    id: 'fac-03',
    name: 'Dr. S. Mukherjee',
    email: 's.mukherjee@oakwood.edu',
    department: 'Computer Science',
    designation: 'Head of Computer Science Department',
    avatarUrl: undefined,
    createdAt: '2026-02-22',
    passwordHash: 'faculty2026',
  },
];

const STORAGE_KEY_USERS = 'smartcampus_registered_faculty';
const STORAGE_KEY_SESSION = 'smartcampus_active_faculty_session';

export function getStoredAccounts(): StoredFacultyAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEED_FACULTY_ACCOUNTS));
      return SEED_FACULTY_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_FACULTY_ACCOUNTS;
  } catch {
    return SEED_FACULTY_ACCOUNTS;
  }
}

export function registerFacultyAccount(account: {
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
}): { success: boolean; error?: string; user?: FacultyUser } {
  const accounts = getStoredAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();

  const exists = accounts.some((a) => a.email.toLowerCase() === normalizedEmail);
  if (exists) {
    return {
      success: false,
      error: 'An account with this institutional email address is already registered. Please sign in.',
    };
  }

  const newUser: StoredFacultyAccount = {
    id: `fac-${Date.now().toString().slice(-5)}`,
    name: account.name.trim(),
    email: normalizedEmail,
    department: account.department,
    designation: account.designation,
    avatarUrl: FACULTY_AVATAR,
    createdAt: new Date().toISOString().slice(0, 10),
    passwordHash: account.password,
  };

  const updated = [newUser, ...accounts];
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));

  const { passwordHash: _, ...publicUser } = newUser;
  return { success: true, user: publicUser };
}

export function loginFacultyAccount(
  email: string,
  password: string
): { success: boolean; error?: string; user?: FacultyUser } {
  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  const matched = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);
  if (!matched) {
    return {
      success: false,
      error: 'No faculty record found for this email address. Please register an account first.',
    };
  }

  if (matched.passwordHash !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your faculty credentials.',
    };
  }

  const { passwordHash: _, ...publicUser } = matched;
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(publicUser));
  return { success: true, user: publicUser };
}

export function getActiveFacultySession(): FacultyUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutFacultySession(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION);
}
