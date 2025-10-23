import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job, JobType, JobCategory } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private mockJobs: Job[] = [
    {
      id: '1',
      title: 'Chef de Cocina',
      company: 'Restaurante El Buen Sabor',
      location: 'Madrid, España',
      description: 'Buscamos chef con experiencia en cocina mediterránea',
      requirements: ['5 años de experiencia', 'Conocimiento de cocina mediterránea'],
      salary: { min: 2000, max: 3000, currency: 'EUR' },
      type: JobType.FULL_TIME,
      category: JobCategory.KITCHEN,
      postedDate: new Date(),
      isActive: true
    },
    {
      id: '2',
      title: 'Camarero/a',
      company: 'Hotel Boutique Central',
      location: 'Barcelona, España',
      description: 'Camarero con experiencia para hotel de lujo',
      requirements: ['Experiencia mínima 2 años', 'Inglés fluido'],
      salary: { min: 1500, max: 2000, currency: 'EUR' },
      type: JobType.FULL_TIME,
      category: JobCategory.SERVICE,
      postedDate: new Date(),
      isActive: true
    },
    {
      id: '3',
      title: 'Recepcionista',
      company: 'Hotel Gran Vía',
      location: 'Valencia, España',
      description: 'Recepcionista para hotel 4 estrellas',
      requirements: ['Atención al cliente', 'Manejo de software hotelero'],
      salary: { min: 1400, max: 1800, currency: 'EUR' },
      type: JobType.PART_TIME,
      category: JobCategory.RECEPTION,
      postedDate: new Date(),
      isActive: true
    }
  ];

  constructor() { }

  getJobs(): Observable<Job[]> {
    return of(this.mockJobs);
  }

  getJobById(id: string): Observable<Job | undefined> {
    return of(this.mockJobs.find(job => job.id === id));
  }
}
