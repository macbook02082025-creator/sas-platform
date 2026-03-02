import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Project } from '@sas-platform/shared-dto';

export interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
};

export const ProjectsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<Project[]>('/api/v1/projects').pipe(
            tap((projects) => patchState(store, { projects, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            })
          )
        )
      )
    ),
    createProject: rxMethod<{ name: string; description?: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ name, description }) =>
          http.post<Project>('/api/v1/projects', { name, description }).pipe(
            tap((newProject) => 
              patchState(store, { 
                projects: [...store.projects(), newProject], 
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
    updateProject: rxMethod<{ id: string; name?: string; description?: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((data) => {
          const { id, ...payload } = data;
          return http.post<Project>(`/api/v1/projects/${id}`, payload).pipe(
            tap((updatedProject) => 
              patchState(store, { 
                projects: store.projects().map(p => p.id === id ? updatedProject : p), 
                isLoading: false 
              })
            ),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of(null as any);
            })
          );
        })
      )
    ),
    deleteProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          http.post(`/api/v1/projects/${id}/delete`, {}).pipe(
            tap(() => 
              patchState(store, { 
                projects: store.projects().filter(p => p.id !== id), 
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
