import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

export interface Activity {
  id: string;
  type: string;
  description: string;
  projectId?: string;
  createdAt: string;
  project?: { name: string };
}

export interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  isLoading: false,
  error: null,
};

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadActivities: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<Activity[]>('/api/v1/activity').pipe(
            tap((activities) => patchState(store, { activities, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            })
          )
        )
      )
    )
  }))
);
