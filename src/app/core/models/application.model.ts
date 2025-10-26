export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  INTERVIEW = 'interview',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: Date;
  updatedDate: Date;
}