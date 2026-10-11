export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface StoredFacultyAccount extends FacultyUser {
  passwordHash: string;
}
