import { Route } from '@angular/router';
import { authGuard, publicGuard } from '@sas-platform/shared-core';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () =>
      loadRemoteModule('mfeAuth', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard'),
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./overview'),
      },
      {
        path: 'stats',
        loadComponent: () => import('./stats-dashboard'),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./skills').then((m) => m.SkillEditorComponent),
      },
      {
        path: 'knowledge',
        loadComponent: () =>
          import('./knowledge').then((m) => m.KnowledgeBaseComponent),
      },
      {
        path: 'chat/:id',
        loadComponent: () =>
          import('./chat').then((m) => m.ChatComponent),
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
