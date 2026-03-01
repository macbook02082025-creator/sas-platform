import { Route } from '@angular/router';
import { authGuard, publicGuard } from '@sas-platform/shared-core';
import { LoginComponent } from './login';
import { SignupComponent } from './signup';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard'),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./overview'),
      },
      {
        path: 'skills/create',
        loadComponent: () =>
          import('./skills').then((m) => m.SkillEditorComponent),
      },
      {
        path: 'knowledge',
        loadComponent: () =>
          import('./knowledge').then((m) => m.KnowledgeBaseComponent),
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
