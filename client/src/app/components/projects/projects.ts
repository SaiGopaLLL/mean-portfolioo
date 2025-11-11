import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding:24px;">
      <h2>Projects</h2>
      <div *ngIf="loading">Loading projects...</div>
      <div *ngIf="!loading && projects.length === 0">No projects yet. Use the server API to add one.</div>
      <div *ngFor="let p of projects" style="border:1px solid #eee; padding:12px; margin-top:10px; border-radius:6px;">
        <h3>{{p.title}}</h3>
        <p>{{p.description}}</p>
        <p class="muted">Tech: {{p.techStack?.join(', ')}}</p>
        <a *ngIf="p.link" [href]="p.link" target="_blank">View</a>
      </div>
    </section>
  `
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  private http = inject(HttpClient);

  ngOnInit() {
    this.http.get('/api/projects').subscribe({
      next: (res: any) => { this.projects = res || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
