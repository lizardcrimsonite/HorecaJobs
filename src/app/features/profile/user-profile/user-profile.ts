import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Candidate, Employer, Experience, UserRole } from '../../../core/models/user.model';
import { Application } from '../../../core/models/application.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfileComponent implements OnInit {
  profile: Candidate | Employer | null = null;
  applications: Application[] = [];
  editMode = false;
  addingSkill = false;
  addingExperience = false;

  profileForm!: FormGroup;
  skillForm!: FormGroup;
  experienceForm!: FormGroup;

  UserRole = UserRole;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
    this.loadApplications();
    this.initForms();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      if (profile) {
        this.updateProfileForm(profile);
      }
    });
  }

  loadApplications(): void {
    this.applicationService.getMyApplications().subscribe((apps) => {
      this.applications = apps;
    });
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      bio: [''],
    });

    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
    });

    this.experienceForm = this.fb.group({
      position: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: [''],
      current: [false],
    });
  }

  updateProfileForm(profile: Candidate | Employer): void {
    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || '',
      location: (profile as Candidate).location || '',
      bio: (profile as Candidate).bio || '',
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.profile) {
      this.updateProfileForm(this.profile);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value).subscribe((success) => {
        if (success) {
          alert('✅ Perfil actualizado exitosamente');
          this.editMode = false;
          this.loadProfile();
        }
      });
    }
  }

  toggleAddSkill(): void {
    this.addingSkill = !this.addingSkill;
    this.skillForm.reset();
  }

  addSkill(): void {
    if (this.skillForm.valid) {
      const skill = this.skillForm.value.skill;
      this.profileService.addSkill(skill).subscribe((success) => {
        if (success) {
          this.skillForm.reset();
          this.addingSkill = false;
          this.loadProfile();
        }
      });
    }
  }

  removeSkill(skill: string): void {
    if (confirm(`¿Eliminar la habilidad "${skill}"?`)) {
      this.profileService.removeSkill(skill).subscribe(() => {
        this.loadProfile();
      });
    }
  }

  toggleAddExperience(): void {
    this.addingExperience = !this.addingExperience;
    this.experienceForm.reset();
  }

  addExperience(): void {
    if (this.experienceForm.valid) {
      const formValue = this.experienceForm.value;
      const experience: Omit<Experience, 'id'> = {
        position: formValue.position,
        company: formValue.company,
        startDate: new Date(formValue.startDate),
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        description: formValue.description,
        current: formValue.current,
      };

      this.profileService.addExperience(experience).subscribe((success) => {
        if (success) {
          this.experienceForm.reset();
          this.addingExperience = false;
          this.loadProfile();
        }
      });
    }
  }

  removeExperience(experienceId: string): void {
    if (confirm('¿Eliminar esta experiencia?')) {
      this.profileService.removeExperience(experienceId).subscribe(() => {
        this.loadProfile();
      });
    }
  }

  isCandidate(): boolean {
    return this.profile?.role === UserRole.CANDIDATE;
  }

  getCandidate(): Candidate | null {
    return this.isCandidate() ? (this.profile as Candidate) : null;
  }
  getPendingCount(): number {
    return this.applications.filter((a) => a.status === 'pending').length;
  }

  getInterviewCount(): number {
    return this.applications.filter((a) => a.status === 'interview').length;
  }

  getAcceptedCount(): number {
    return this.applications.filter((a) => a.status === 'accepted').length;
  }
}
