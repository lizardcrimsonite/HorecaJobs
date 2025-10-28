import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, Candidate, Employer, Experience, UserRole } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject: BehaviorSubject<Candidate | Employer | null>;
  public profile$: Observable<Candidate | Employer | null>;

  constructor(private authService: AuthService) {
    const storedProfile = localStorage.getItem('userProfile');
    const initialProfile = storedProfile ? JSON.parse(storedProfile) : this.createDefaultProfile();
    
    this.profileSubject = new BehaviorSubject<Candidate | Employer | null>(initialProfile);
    this.profile$ = this.profileSubject.asObservable();

    if (initialProfile) {
      localStorage.setItem('userProfile', JSON.stringify(initialProfile));
    }
  }

  private createDefaultProfile(): Candidate | null {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return null;

    if (currentUser.role === UserRole.CANDIDATE) {
      return {
        ...currentUser,
        role: UserRole.CANDIDATE,
        skills: ['Trabajo en equipo', 'Comunicación', 'Gestión del tiempo'],
        experience: [
          {
            id: '1',
            position: 'Camarero',
            company: 'Restaurante La Vida',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-12-31'),
            description: 'Atención al cliente, servicio de mesas, gestión de reservas',
            current: false
          }
        ],
        education: [
          {
            id: '1',
            degree: 'Técnico en Hostelería',
            institution: 'Instituto Gastronómico',
            year: 2021
          }
        ],
        bio: 'Profesional de hostelería con pasión por el servicio al cliente',
        location: 'Madrid, España'
      };
    }

    return null;
  }

  getProfile(): Observable<Candidate | Employer | null> {
    return this.profile$;
  }

  updateProfile(profile: Partial<Candidate | Employer>): Observable<boolean> {
  const currentProfile = this.profileSubject.value;
  if (!currentProfile) return of(false);

  const updatedProfile = { ...currentProfile, ...profile } as Candidate | Employer;
  this.profileSubject.next(updatedProfile);
  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

  return of(true).pipe(delay(500));
}

  addExperience(experience: Omit<Experience, 'id'>): Observable<boolean> {
    const currentProfile = this.profileSubject.value;
    if (!currentProfile || currentProfile.role !== UserRole.CANDIDATE) return of(false);

    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString()
    };

    const updatedProfile: Candidate = {
      ...currentProfile,
      experience: [...currentProfile.experience, newExperience]
    };

    this.profileSubject.next(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    return of(true).pipe(delay(300));
  }

  removeExperience(experienceId: string): Observable<boolean> {
    const currentProfile = this.profileSubject.value;
    if (!currentProfile || currentProfile.role !== UserRole.CANDIDATE) return of(false);

    const updatedProfile: Candidate = {
      ...currentProfile,
      experience: currentProfile.experience.filter(exp => exp.id !== experienceId)
    };

    this.profileSubject.next(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    return of(true).pipe(delay(300));
  }

  addSkill(skill: string): Observable<boolean> {
    const currentProfile = this.profileSubject.value;
    if (!currentProfile || currentProfile.role !== UserRole.CANDIDATE) return of(false);

    if (currentProfile.skills.includes(skill)) return of(false);

    const updatedProfile: Candidate = {
      ...currentProfile,
      skills: [...currentProfile.skills, skill]
    };

    this.profileSubject.next(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    return of(true).pipe(delay(300));
  }

  removeSkill(skill: string): Observable<boolean> {
    const currentProfile = this.profileSubject.value;
    if (!currentProfile || currentProfile.role !== UserRole.CANDIDATE) return of(false);

    const updatedProfile: Candidate = {
      ...currentProfile,
      skills: currentProfile.skills.filter(s => s !== skill)
    };

    this.profileSubject.next(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    return of(true).pipe(delay(300));
  }
}