import { signalStore, withState, withMethods, withHooks, patchState } from '@ngrx/signals';

export type Theme = 'midnight' | 'slate' | 'forest' | 'void' | 'nebula';

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: (localStorage.getItem('theme') as Theme) || 'midnight',
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setTheme(theme: Theme) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      patchState(store, { theme });
    },
    init() {
      document.documentElement.setAttribute('data-theme', store.theme());
    }
  })),
  withHooks({
    onInit(store) {
      store.init();
    }
  })
);
