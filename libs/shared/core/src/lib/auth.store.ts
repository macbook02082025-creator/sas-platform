import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { User, AuthResponse, LoginDto, RegisterDto } from '@sas-platform/shared-dto';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthState {
  user: User | null;
  currentOrganizationId: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  currentOrganizationId: localStorage.getItem('tenant_id'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    login: rxMethod<LoginDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tap((response: AuthResponse) => {
              const orgId = response.user.organizations?.[0]?.id || null;
              if (orgId) localStorage.setItem('tenant_id', orgId);
              
              patchState(store, {
                user: response.user,
                currentOrganizationId: orgId,
                isAuthenticated: true,
                isLoading: false,
              });
              router.navigate(['/dashboard']);
            }),
            catchError((err) => {
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
    register: rxMethod<RegisterDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((data) =>
          authService.register(data).pipe(
            tap((response: AuthResponse) => {
              const orgId = response.user.organizations?.[0]?.id || null;
              if (orgId) localStorage.setItem('tenant_id', orgId);

              patchState(store, {
                user: response.user,
                currentOrganizationId: orgId,
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
    setOrganization(id: string) {
      localStorage.setItem('tenant_id', id);
      patchState(store, { currentOrganizationId: id });
      // Force reload to refresh all data stores with the new tenant context
      window.location.reload();
    },
    logout() {
      authService.logout();
      localStorage.removeItem('tenant_id');
      patchState(store, {
        user: null,
        currentOrganizationId: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      router.navigate(['/auth/login']);
    },
    init() {
      const token = authService.getToken();
      if (token) {
        patchState(store, { isLoading: true });
        authService.me().subscribe({
          next: (user) => {
            let orgId = store.currentOrganizationId();
            if (!orgId || !user.organizations?.find(o => o.id === orgId)) {
              orgId = user.organizations?.[0]?.id || null;
            }
            
            if (orgId) localStorage.setItem('tenant_id', orgId);

            patchState(store, { 
              user, 
              currentOrganizationId: orgId,
              isAuthenticated: true, 
              isLoading: false 
            });
            if (window.location.pathname.startsWith('/auth')) {
              router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            authService.logout();
            localStorage.removeItem('tenant_id');
            patchState(store, {
              user: null,
              currentOrganizationId: null,
              isAuthenticated: false,
              isLoading: false
            });
            router.navigate(['/auth/login']);
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
