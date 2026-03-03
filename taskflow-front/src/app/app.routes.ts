import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login')
      .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register')
      .then(m => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard')
      .then(m => m.Dashboard)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./components/projects/project-list/project-list')
      .then(m => m.ProjectList)
  },
  {
    path: 'projects/:id/tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./components/tasks/task-list/task-list')
      .then(m => m.TaskList)
  },
  { path: '**', redirectTo: 'dashboard' }
];