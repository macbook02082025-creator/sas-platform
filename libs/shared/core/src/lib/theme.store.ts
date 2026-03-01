import { signalStore, withState, withMethods, withHooks, patchState } from '@ngrx/signals';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: (localStorage.getItem('theme') as Theme) || 'dark',
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
    toggleTheme() {
      const newTheme = store.theme() === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
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
