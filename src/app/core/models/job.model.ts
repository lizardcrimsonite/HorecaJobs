export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  TEMPORARY = 'temporary'
}

export enum JobCategory {
  KITCHEN = 'kitchen',
  SERVICE = 'service',
  MANAGEMENT = 'management',
  RECEPTION = 'reception'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: JobType;
  category: JobCategory;
  postedDate: Date;
  isActive: boolean;
}
