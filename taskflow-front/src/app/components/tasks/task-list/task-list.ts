import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task';
import { AuthService } from '../../../services/auth';
import { Task, TaskStatus, TaskPriority } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  tasks        = signal<Task[]>([]);
  loading      = signal(true);
  showForm     = signal(false);
  editingTask  = signal<Task | null>(null);
  projectId!: number;
  filterStatus   = signal('');
  filterPriority = signal('');
  form: FormGroup;

  statusLabels: Record<TaskStatus, string> = {
    todo: 'À faire', in_progress: 'En cours', done: 'Terminé'
  };
  priorityLabels: Record<TaskPriority, string> = {
    low: 'Basse', medium: 'Moyenne', high: 'Haute'
  };

  constructor(
    private taskService: TaskService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      status:      ['todo'],
      priority:    ['medium'],
    });
  }

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    const filters = {
      status:   this.filterStatus()   || undefined,
      priority: this.filterPriority() || undefined,
    };
    this.taskService.getAll(this.projectId, filters).subscribe({
      next: (data) => { this.tasks.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(type: 'status' | 'priority', value: string) {
    if (type === 'status')   this.filterStatus.set(value);
    if (type === 'priority') this.filterPriority.set(value);
    this.load();
  }

  openCreate() {
    this.editingTask.set(null);
    this.form.reset({ status: 'todo', priority: 'medium' });
    this.showForm.set(true);
  }

  openEdit(t: Task) {
    this.editingTask.set(t);
    this.form.patchValue(t);
    this.showForm.set(true);
  }

  submit() {
    if (this.form.invalid) return;
    const editing = this.editingTask();
    const obs = editing
      ? this.taskService.update(this.projectId, editing.id, this.form.value)
      : this.taskService.create(this.projectId, this.form.value);
    obs.subscribe(() => { this.showForm.set(false); this.load(); });
  }

  changeStatus(task: Task, status: string) {
    this.taskService.update(this.projectId, task.id, { status: status as TaskStatus }).subscribe(() => this.load());
  }

  delete(id: number) {
    if (!confirm('Supprimer cette tâche ?')) return;
    this.taskService.delete(this.projectId, id).subscribe(() => this.load());
  }

  logout() { this.auth.logout(); }
}