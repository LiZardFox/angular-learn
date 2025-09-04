import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home', loadComponent: () => import('./home/home')
    },
    {
        path: 'todo', loadChildren: () => import('./todo/todo.routes')
    },
    {
        path: 'slideshow', loadChildren: () => import('./slideshow/slideshow.routes')
    },
    {
        path: 'portals', loadChildren: () => import('./portals/portals.routes')
    },
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
];
