import { Route } from '@angular/router';
import { provideNgtRenderer } from 'angular-three/dom';

export default [
  {
    path: '',
    loadComponent: () => import('./portals'),
    providers: [provideNgtRenderer()],
  },
] as Route[];
