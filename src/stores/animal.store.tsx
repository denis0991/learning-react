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
  totalPages: number;
  currentPage: number;
  isPaginating: boolean;

  setInputValue: (value: string) => void;
  setResult: (result: Animals[]) => void;
  setStatus: (status: Status) => void;
  setErrorResetTrigger: (trigger: number | ((prev: number) => number)) => void;
  setLackOfResult: (lack: boolean) => void;
  setSearchError: (error: boolean) => void;
  setErrorMessage: (message: string) => void;
  setTotalPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
  setIsPaginating: (isPaginating: boolean) => void;
  resetPage: () => void;
  setSearchState: (newResult: Animals[], totalPages?: number) => void;
}

export const useAnimalStore = create<AnimalState>((set, get) => ({
  inputValue: '',
  result: [],
  status: 'default',
  errorResetTrigger: 0,
  lackOfResult: false,
  searchError: false,
  errorMessage: '',
  totalPages: 0,
  currentPage: 1,
  isPaginating: false,

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
  setTotalPages: (pages) => set({ totalPages: pages }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsPaginating: (isPaginating) => set({ isPaginating }),
  resetPage: () => set({ currentPage: 1 }),
  setSearchState: (newResult, totalPages) => {
    set({
      result: newResult,
      totalPages: totalPages ?? get().totalPages,
      currentPage: 1,
    });
  },
}));
