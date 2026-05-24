import { create } from 'zustand';
import type { Animals, Status } from '../index';

interface AnimalState {
  inputValue: string;
  result: Animals[];
  status: Status;
  errorResetTrigger: number;

  setInputValue: (value: string) => void;
  setResult: (result: Animals[]) => void;
  setStatus: (status: Status) => void;
  setErrorResetTrigger: (trigger: number | ((prev: number) => number)) => void;
}

export const useAnimalStore = create<AnimalState>((set) => ({
  inputValue: '',
  result: [],
  status: 'default',
  errorResetTrigger: 0,

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
}));
