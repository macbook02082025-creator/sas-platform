import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService, User, AuthResponse } from './auth.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<any>(
      pipe(
        tap(() => {
          console.log('AuthStore: Starting Login...');
          patchState(store, { isLoading: true, error: null });
        }),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tap((response: AuthResponse) => {
              console.log('AuthStore: Login Success', response);
              patchState(store, {
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
              });
              console.log('AuthStore: Navigating to dashboard...');
              router.navigate(['/dashboard']).then(navigated => {
                console.log('AuthStore: Navigation finished', navigated);
              });
            }),
            catchError((err) => {
              console.error('AuthStore: Login Error', err);
              patchState(store, {
                isLoading: false,
                error: err.error?.message || 'Login failed',
              });
              return of(err);
            })
          )
        )
      )
    ),
    register: rxMethod<any>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((data) =>
          authService.register(data).pipe(
            tap((response: AuthResponse) => {
              patchState(store, {
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
              });
              router.navigate(['/dashboard']);
            }),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.error?.message || 'Registration failed',
              });
              return of(err);
            })
          )
        )
      )
    ),
    logout() {
      console.log('AuthStore: Logging out');
      authService.logout();
      patchState(store, initialState);
      router.navigate(['/auth/login']);
    },
    init() {
      const token = authService.getToken();
      console.log('AuthStore: Initializing with token:', !!token);
      if (token) {
        patchState(store, { isLoading: true });
        authService.me().subscribe({
          next: (user) => {
            console.log('AuthStore: Session restored', user);
            patchState(store, { user, isAuthenticated: true, isLoading: false });
            if (window.location.pathname.startsWith('/auth')) {
              router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.warn('AuthStore: Token invalid or expired', err);
            authService.logout();
            patchState(store, { user: null, isAuthenticated: false, isLoading: false });
          }
        });
      }
    }
  })),
  withHooks({
    onInit(store) {
      store.init();
    }
  })
);
