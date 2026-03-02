import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  key?: string; // Only on creation
  lastUsedAt?: string;
  createdAt: string;
}

export interface ApiKeysState {
  keys: ApiKey[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ApiKeysState = {
  keys: [],
  isLoading: false,
  error: null,
};

export const ApiKeysStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadKeys: rxMethod<{ projectId: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ projectId }) =>
          http.get<ApiKey[]>(`/api/v1/api-keys?projectId=${projectId}`).pipe(
            tap((keys) => patchState(store, { keys, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            })
          )
        )
      )
    ),
    createKey: rxMethod<{ projectId: string; name: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ projectId, name }) =>
          http.post<ApiKey>('/api/v1/api-keys', { projectId, name }).pipe(
            tap((newKey) => 
              patchState(store, { 
                keys: [...store.keys(), newKey], 
                isLoading: false 
              })
            ),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of(null as any);
            })
          )
        )
      )
    ),
    deleteKey: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          http.post(`/api/v1/api-keys/${id}/delete`, {}).pipe(
            tap(() => 
              patchState(store, { 
                keys: store.keys().filter(k => k.id !== id), 
                isLoading: false 
              })
            ),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of(null as any);
            })
          )
        )
      )
    )
  }))
);
