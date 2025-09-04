import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./overview'),
  },
  {
    path: 'play',
    loadComponent: () => import('./play'),
    children: [
      {
        path: 'hiragana',
        loadComponent: () => import('../games/hiragana'),
      },
    ],
  },
] as Route[];
