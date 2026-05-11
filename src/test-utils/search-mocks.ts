import type { Animals } from '../components/search/search.interfaces';
import { vi } from 'vitest';
import type { Status } from '../components/search/search.interfaces';

export const mockAnimals: Animals[] = [
  {
    uid: '1',
    name: 'Lion',
    avian: false,
    earthAnimal: true,
    feline: true,
    earthInsect: false,
    canine: false,
  },
  {
    uid: '2',
    name: 'Eagle',
    avian: true,
    earthAnimal: false,
    feline: false,
    earthInsect: false,
    canine: false,
  },
  {
    uid: '3',
    name: 'Cat',
    avian: false,
    earthAnimal: true,
    feline: true,
    earthInsect: false,
    canine: false,
  },
];

export const mockFetch = vi.fn();
global.fetch = mockFetch;

export const createSearchMocks = () => ({
  setInputValue: vi.fn(),
  setStatus: vi.fn(),
  setSearchState: vi.fn(),
  setSearchError: vi.fn(),
  setError: vi.fn(),
  setErrorMessage: vi.fn(),
});

export const getDefaultSearchProps = (
  overrides: Partial<
    ReturnType<typeof createSearchMocks> & {
      value: string;
      status: Status;
    }
  > = {}
) => {
  const mocks = createSearchMocks();

  return {
    value: '',
    status: 'default' as Status,
    ...mocks,
    ...overrides,
  };
};

export const mockAnimalsData = {
  single: [
    { uid: '1', name: 'Lion', avian: false, earthAnimal: true, feline: true },
  ],
  multiple: [
    { uid: '1', name: 'Lion', avian: false, earthAnimal: true, feline: true },
    { uid: '2', name: 'Eagle', avian: true, earthAnimal: false, feline: false },
    { uid: '3', name: 'Cat', avian: false, earthAnimal: true, feline: true },
  ],
  empty: [],
};

export const mockApiResponses = {
  success: (data = mockAnimalsData.single) => ({
    ok: true,
    json: async () => ({ animals: data }),
  }),

  empty: () => ({
    ok: true,
    json: async () => ({ animals: [] }),
  }),

  httpError: (status = 500) => ({
    ok: false,
    status,
  }),

  networkError: (message = 'Failed to fetch') => new Error(message),

  corsError: () => new Error('CORS error'),
};
