import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applications: Application[] = [];

  constructor() {
    // Cargar aplicaciones del localStorage si existen
    const stored = localStorage.getItem('applications');
    if (stored) {
      this.applications = JSON.parse(stored);
    }
  }

  getMyApplications(): Observable<Application[]> {
    return of(this.applications);
  }

  addApplication(application: Omit<Application, 'id' | 'appliedDate' | 'updatedDate'>): Observable<Application> {
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      appliedDate: new Date(),
      updatedDate: new Date()
    };

    this.applications.push(newApplication);
    this.saveToLocalStorage();
    
    return of(newApplication);
  }

  cancelApplication(applicationId: string): Observable<boolean> {
    const index = this.applications.findIndex(app => app.id === applicationId);
    if (index !== -1) {
      this.applications.splice(index, 1);
      this.saveToLocalStorage();
      return of(true);
    }
    return of(false);
  }

  hasAppliedToJob(jobId: string): boolean {
    return this.applications.some(app => app.jobId === jobId);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('applications', JSON.stringify(this.applications));
  }
}