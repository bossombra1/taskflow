import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(projectId: number, filters?: { status?: string; priority?: string }): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.status)   params = params.set('status',   filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`, { params });
  }

  create(projectId: number, data: Partial<Task> & { user_ids?: number[] }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, data);
  }

  update(projectId: number, taskId: number, data: Partial<Task> & { user_ids?: number[] }): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, data);
  }

  delete(projectId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`);
  }
}