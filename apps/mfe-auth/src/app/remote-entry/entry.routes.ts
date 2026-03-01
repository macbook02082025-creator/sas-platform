import { Route } from '@angular/router';
import { LoginComponent } from '../login';
import { SignupComponent } from '../signup';

export const remoteRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
