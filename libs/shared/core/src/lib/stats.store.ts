import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

export interface PlatformStats {
  activeUnits: number;
  skillsDeployed: number;
  dataVaults: number;
  uptimeScore: number;
  activeUnitsTrend: string;
  skillsTrend: string;
  vaultsTrend: string;
  uptimeTrend: string;
}

export interface StatsState {
  stats: PlatformStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  isLoading: false,
  error: null,
};

export const StatsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadStats: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<PlatformStats>('/api/v1/stats').pipe(
            tap((stats) => patchState(store, { stats, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of(null);
            })
          )
        )
      )
    )
  }))
);
