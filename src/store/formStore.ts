import { create } from 'zustand';
import type { FormData } from '../types/form';
import { countries } from '../constants/countries';

interface FormStore {
  submissions: FormData[];
  countries: string[];
  addSubmission: (
    data: Omit<FormData, 'id' | 'submittedAt' | 'isNewlySubmitted'>
  ) => void;
  clearNewFlag: (id: string) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  submissions: [],
  countries: countries,

  addSubmission: (data) => {
    const newSubmission: FormData = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date(),
      isNewlySubmitted: true,
    };

    console.log('Adding submission:', newSubmission);

    set((state) => ({
      submissions: [newSubmission, ...state.submissions],
    }));

    setTimeout(() => {
      set((state) => ({
        submissions: state.submissions.map((sub) =>
          sub.id === newSubmission.id
            ? { ...sub, isNewlySubmitted: false }
            : sub
        ),
      }));
    }, 3000);
  },

  clearNewFlag: (id) => {
    set((state) => ({
      submissions: state.submissions.map((sub) =>
        sub.id === id ? { ...sub, isNewlySubmitted: false } : sub
      ),
    }));
  },
}));
