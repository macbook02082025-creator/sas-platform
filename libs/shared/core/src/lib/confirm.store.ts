import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
  resolve: ((value: boolean) => void) | null;
}

const initialState: ConfirmState = {
  isOpen: false,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: true,
  resolve: null,
};

export const ConfirmStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    ask(options: {
      title?: string;
      message: string;
      confirmLabel?: string;
      cancelLabel?: string;
      danger?: boolean;
    }): Promise<boolean> {
      return new Promise((resolve) => {
        patchState(store, {
          isOpen: true,
          title: options.title || 'Confirm Action',
          message: options.message,
          confirmLabel: options.confirmLabel || 'Confirm',
          cancelLabel: options.cancelLabel || 'Cancel',
          danger: options.danger !== undefined ? options.danger : true,
          resolve,
        });
      });
    },
    confirm() {
      if (store.resolve()) {
        store.resolve()!(true);
      }
      patchState(store, { isOpen: false, resolve: null });
    },
    cancel() {
      if (store.resolve()) {
        store.resolve()!(false);
      }
      patchState(store, { isOpen: false, resolve: null });
    },
  }))
);
