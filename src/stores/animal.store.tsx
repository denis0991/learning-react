import { create } from 'zustand';

interface AnimalState {
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const useAnimalStore = create<AnimalState>((set) => ({
  inputValue: '',
  setInputValue: (value) => set({ inputValue: value }),
}));
