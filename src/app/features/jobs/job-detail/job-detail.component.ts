import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job?: Job;
  isLoggedIn = false;
  hasApplied = false;
  applying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobService.getJobById(id).subscribe(job => {
        this.job = job;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }

  applyToJob(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.applying = true;
    
    // Simulamos el envío de aplicación
    setTimeout(() => {
      this.hasApplied = true;
      this.applying = false;
      alert('¡Aplicación enviada con éxito! 🎉');
    }, 1500);
  }

  getJobTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'full_time': 'Tiempo Completo',
      'part_time': 'Medio Tiempo',
      'temporary': 'Temporal'
    };
    return labels[type] || type;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'kitchen': 'Cocina',
      'service': 'Servicio',
      'management': 'Gerencia',
      'reception': 'Recepción'
    };
    return labels[category] || category;
  }
}