import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job, JobType, JobCategory } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = true;

  // Filtros
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  selectedLocation = '';

  // Opciones para los filtros
  categories = [
    { value: '', label: 'Todas las categorías' },
    { value: JobCategory.KITCHEN, label: 'Cocina' },
    { value: JobCategory.SERVICE, label: 'Servicio' },
    { value: JobCategory.MANAGEMENT, label: 'Gerencia' },
    { value: JobCategory.RECEPTION, label: 'Recepción' }
  ];

  types = [
    { value: '', label: 'Todos los tipos' },
    { value: JobType.FULL_TIME, label: 'Tiempo Completo' },
    { value: JobType.PART_TIME, label: 'Medio Tiempo' },
    { value: JobType.TEMPORARY, label: 'Temporal' }
  ];

  locations: string[] = [];

  constructor(
    private jobService: JobService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      this.filteredJobs = jobs;
      this.extractLocations();
      this.loading = false;
    });
  }

  extractLocations(): void {
    const uniqueLocations = [...new Set(this.jobs.map(job => job.location))];
    this.locations = ['', ...uniqueLocations];
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm || 
        job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory || job.category === this.selectedCategory;
      const matchesType = !this.selectedType || job.type === this.selectedType;
      const matchesLocation = !this.selectedLocation || job.location === this.selectedLocation;

      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedType = '';
    this.selectedLocation = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCategory || this.selectedType || this.selectedLocation);
  }

  viewJob(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  getCategoryLabel(category: string): string {
    const found = this.categories.find(c => c.value === category);
    return found ? found.label : category;
  }

  getTypeLabel(type: string): string {
    const found = this.types.find(t => t.value === type);
    return found ? found.label : type;
  }
}