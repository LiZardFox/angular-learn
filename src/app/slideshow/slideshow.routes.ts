import { Route } from "@angular/router";

export default [
    {
        path: '', loadComponent: () => import('./slideshow').then(c => c.Slideshow)
    }
] as Route[];