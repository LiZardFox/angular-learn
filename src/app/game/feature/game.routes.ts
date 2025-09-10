import { Route } from '@angular/router';
import { provideNgtRenderer } from 'angular-three/dom';

export default [
  {
    path: '',
    loadComponent: () => import('./overview'),
  },
  {
    path: 'play/axe-throwing',
    loadComponent: () => import('../games/axe-throwing/axe-throwing'),
    providers: [provideNgtRenderer()],
  },
  {
    path: 'play',
    loadComponent: () => import('./play'),
    providers: [provideNgtRenderer()],
    children: [
      {
        path: 'kana',
        loadComponent: () => import('../games/hiragana/kana-game'),
      },
      {
        path: 'third-person-controller',
        loadComponent: () =>
          import('../games/third-person-controller/experience'),
      },
    ],
  },
] as Route[];
