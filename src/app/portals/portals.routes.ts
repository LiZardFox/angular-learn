import { Route } from "@angular/router";

export default [
    {
        path: '', loadComponent: () => import('./portals')
    }
] as Route[];