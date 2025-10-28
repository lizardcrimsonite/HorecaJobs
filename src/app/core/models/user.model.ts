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
  avatar?: string;
  createdAt: Date;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: number;
}

export interface Candidate extends User {
  role: UserRole.CANDIDATE;
  resume?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  bio?: string;
  location?: string;
}

export interface Employer extends User {
  role: UserRole.EMPLOYER;
  companyName: string;
  companyLogo?: string;
  description?: string;
  website?: string;
  industry?: string;
}