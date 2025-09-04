import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./feature/todo'),
  },
  {
    path: ':id',
    loadComponent: () => import('./feature/todo-detail'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./feature/todo-edit'),
  },
] as Routes;
