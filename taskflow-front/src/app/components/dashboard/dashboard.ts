import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

interface DashboardData {
  total_tasks: number;
  done_tasks: number;
  todo_tasks: number;
  in_progress_tasks: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  data    = signal<DashboardData | null>(null);
  loading = signal(true);
  today   = new Date();

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`).subscribe({
      next: (res) => { this.data.set(res); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  logout() { this.auth.logout(); }
}