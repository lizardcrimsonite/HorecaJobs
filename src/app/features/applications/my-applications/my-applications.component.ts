import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getMyApplications().subscribe(apps => {
      this.applications = apps;
      this.loading = false;
    });
  }

  cancelApplication(applicationId: string, jobTitle: string): void {
    if (confirm(`¿Estás seguro de cancelar tu aplicación a "${jobTitle}"?`)) {
      this.applicationService.cancelApplication(applicationId).subscribe(success => {
        if (success) {
          this.applications = this.applications.filter(app => app.id !== applicationId);
          alert('Aplicación cancelada exitosamente');
        }
      });
    }
  }

  viewJobDetail(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  getStatusLabel(status: ApplicationStatus): string {
    const labels: { [key: string]: string } = {
      [ApplicationStatus.PENDING]: 'Pendiente',
      [ApplicationStatus.REVIEWED]: 'Revisado',
      [ApplicationStatus.INTERVIEW]: 'Entrevista',
      [ApplicationStatus.ACCEPTED]: 'Aceptado',
      [ApplicationStatus.REJECTED]: 'Rechazado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: ApplicationStatus): string {
    return `status-${status}`;
  }

  getStatusIcon(status: ApplicationStatus): string {
    const icons: { [key: string]: string } = {
      [ApplicationStatus.PENDING]: '⏳',
      [ApplicationStatus.REVIEWED]: '👀',
      [ApplicationStatus.INTERVIEW]: '📞',
      [ApplicationStatus.ACCEPTED]: '✅',
      [ApplicationStatus.REJECTED]: '❌'
    };
    return icons[status] || '📋';
  }
}