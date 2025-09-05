import { Route } from '@angular/router';
import { provideNgtRenderer } from 'angular-three/dom';

export default [
  {
    path: '',
    loadComponent: () => import('./slideshow').then((c) => c.Slideshow),
    providers: [provideNgtRenderer()],
  },
] as Route[];
