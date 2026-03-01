import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

export interface Skill {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  temperature: number;
  modelName: string;
  projectId: string;
  createdAt: string;
}

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
    loadSkills: rxMethod<{ projectId: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ projectId }) =>
          http.get<Skill[]>(`/api/v1/skills?projectId=${projectId}`).pipe(
            tap((skills) => patchState(store, { skills, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            })
          )
        )
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
              return of(null);
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
              return of(null);
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
              return of(null);
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
