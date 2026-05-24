import { create } from 'zustand';
import type { Animals, Status } from '../index';

interface AnimalState {
  inputValue: string;
  result: Animals[];
  status: Status;
  errorResetTrigger: number;
  lackOfResult: boolean;
  searchError: boolean;
  errorMessage: string;

  setInputValue: (value: string) => void;
  setResult: (result: Animals[]) => void;
  setStatus: (status: Status) => void;
  setErrorResetTrigger: (trigger: number | ((prev: number) => number)) => void;
  setLackOfResult: (lack: boolean) => void;
  setSearchError: (error: boolean) => void;
  setErrorMessage: (message: string) => void;
}

export const useAnimalStore = create<AnimalState>((set) => ({
  inputValue: '',
  result: [],
  status: 'default',
  errorResetTrigger: 0,
  lackOfResult: false,
  searchError: false,
  errorMessage: '',

  setInputValue: (value) => set({ inputValue: value }),
  setResult: (result) => set({ result }),
  setStatus: (status) => set({ status }),
  setErrorResetTrigger: (trigger) =>
    set((state) => ({
      errorResetTrigger:
        typeof trigger === 'function'
          ? trigger(state.errorResetTrigger)
          : trigger,
    })),
  setLackOfResult: (lack) => set({ lackOfResult: lack }),
  setSearchError: (error) => set({ searchError: error }),
  setErrorMessage: (message) => set({ errorMessage: message }),
}));
