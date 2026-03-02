import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Skill } from '@sas-platform/shared-dto';

export interface SkillsState {
  skills: Skill[];
  currentSkill: Skill | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SkillsState = {
  skills: [],
  currentSkill: null,
  isLoading: false,
  error: null,
};

export const SkillsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadSkills: rxMethod<{ projectId?: string } | void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((arg) => {
          const projectId = arg && typeof arg === 'object' ? arg.projectId : undefined;
          const url = projectId ? `/api/v1/skills?projectId=${projectId}` : '/api/v1/skills';
          
          return http.get<Skill[]>(url).pipe(
            tap((skills) => patchState(store, { skills, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            })
          );
        })
      )
    ),
    createSkill: rxMethod<Partial<Skill>>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((skillData) =>
          http.post<Skill>('/api/v1/skills', skillData).pipe(
            tap((newSkill) => 
              patchState(store, { 
                skills: [...store.skills(), newSkill], 
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
    updateSkill: rxMethod<{ id: string; data: Partial<Skill> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ id, data }) =>
          http.post<Skill>(`/api/v1/skills/${id}`, data).pipe(
            tap((updatedSkill) => 
              patchState(store, { 
                skills: store.skills().map(s => s.id === id ? updatedSkill : s), 
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
    deleteSkill: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          http.post(`/api/v1/skills/${id}/delete`, {}).pipe(
            tap(() => 
              patchState(store, { 
                skills: store.skills().filter(s => s.id !== id), 
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
    setCurrentSkill(skill: Skill | null) {
      patchState(store, { currentSkill: skill });
    }
  }))
);
