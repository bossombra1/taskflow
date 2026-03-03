import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project';
import { AuthService } from '../../../services/auth';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectList implements OnInit {
  projects = signal<Project[]>([]);
  loading  = signal(true);
  showForm = signal(false);
  editingProject = signal<Project | null>(null);
  form: FormGroup;

  constructor(
    private projectService: ProjectService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      color:       ['#6366f1'],
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.projectService.getAll().subscribe({
      next: (data) => { this.projects.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate() {
    this.editingProject.set(null);
    this.form.reset({ color: '#6366f1' });
    this.showForm.set(true);
  }

  openEdit(p: Project) {
    this.editingProject.set(p);
    this.form.patchValue(p);
    this.showForm.set(true);
  }

  submit() {
    if (this.form.invalid) return;
    const editing = this.editingProject();
    const obs = editing
      ? this.projectService.update(editing.id, this.form.value)
      : this.projectService.create(this.form.value);

    obs.subscribe(() => { this.showForm.set(false); this.load(); });
  }

  delete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    this.projectService.delete(id).subscribe(() => this.load());
  }

  logout() { this.auth.logout(); }
}