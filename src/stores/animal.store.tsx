import { create } from 'zustand';
import type { Animals } from '../index';

interface AnimalState {
  inputValue: string;
  result: Animals[];

  setInputValue: (value: string) => void;
  setResult: (result: Animals[]) => void;
}

export const useAnimalStore = create<AnimalState>((set) => ({
  inputValue: '',
  result: [],

  setInputValue: (value) => set({ inputValue: value }),
  setResult: (result) => set({ result }),
}));
