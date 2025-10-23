export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Candidate extends User {
  role: UserRole.CANDIDATE;
  skills: string[];
}

export interface Employer extends User {
  role: UserRole.EMPLOYER;
  companyName: string;
  companyLogo?: string;
}
