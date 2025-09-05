import { Route } from '@angular/router';
import { provideNgtRenderer } from 'angular-three/dom';

export default [
  {
    path: '',
    loadComponent: () => import('./overview'),
  },
  {
    path: 'play',
    loadComponent: () => import('./play'),
    providers: [provideNgtRenderer()],
    children: [
      {
        path: 'hiragana',
        loadComponent: () => import('../games/hiragana/kana-game'),
      },
    ],
  },
] as Route[];
