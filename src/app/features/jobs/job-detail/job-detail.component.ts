import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job?: Job;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.jobService.getJobById(id).pipe(
        catchError(error => {
          this.error = 'Error loading job details. Please try again later.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(job => {
        if (job) {
          this.job = job;
        }
      });
    } else {
      this.error = 'No job ID provided';
    }
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
