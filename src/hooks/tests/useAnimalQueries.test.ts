import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useSearchAnimals,
  useAnimalDetails,
  animalKeys,
  usePrefetchAnimalDetails,
  useInvalidateAnimalCache,
} from '../useAnimalQueries';
import { animalApi } from '../../services/animalApi';

vi.mock('../../services/animalApi', () => ({
  animalApi: {
    searchAnimals: vi.fn(),
    getAnimalDetails: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('useAnimalQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSearchAnimals', () => {
    it('should have enabled false by default', () => {
      const { result } = renderHook(() => useSearchAnimals('test', 1), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('should fetch data when refetch is called', async () => {
      const mockData = {
        animals: [{ uid: '1', name: 'Tiger' }],
        page: { totalPages: 1 },
      };
      (animalApi.searchAnimals as Mock).mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useSearchAnimals('tiger', 1), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      expect(animalApi.searchAnimals).toHaveBeenCalledWith('tiger', 1);
    });

    it('should handle error when API fails', async () => {
      (animalApi.searchAnimals as Mock).mockRejectedValueOnce(
        new Error('API Error')
      );

      const { result } = renderHook(() => useSearchAnimals('error', 1), {
        wrapper: createWrapper(),
      });

      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useAnimalDetails', () => {
    it('should not fetch when uid is undefined', () => {
      const { result } = renderHook(() => useAnimalDetails(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(animalApi.getAnimalDetails).not.toHaveBeenCalled();
    });

    it('should fetch when uid is provided', async () => {
      const mockData = { animal: { uid: '1', name: 'Lion' } };
      (animalApi.getAnimalDetails as Mock).mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useAnimalDetails('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(animalApi.getAnimalDetails).toHaveBeenCalledWith('1');
    });

    it('should handle error when API fails', async () => {
      (animalApi.getAnimalDetails as Mock).mockRejectedValueOnce(
        new Error('Not found')
      );

      const { result } = renderHook(() => useAnimalDetails('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('animalKeys', () => {
    it('should generate correct search key', () => {
      const key = animalKeys.search('cat', 2);
      expect(key).toEqual(['animals', 'search', 'cat', 2]);
    });

    it('should generate correct details key', () => {
      const key = animalKeys.details('123');
      expect(key).toEqual(['animals', 'details', '123']);
    });

    it('should generate correct all key', () => {
      expect(animalKeys.all).toEqual(['animals']);
    });
  });
});

describe('usePrefetchAnimalDetails', () => {
  it('should prefetch details', () => {
    const { result } = renderHook(() => usePrefetchAnimalDetails(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeDefined();
  });
});

describe('useInvalidateAnimalCache', () => {
  it('should invalidate cache', () => {
    const { result } = renderHook(() => useInvalidateAnimalCache(), {
      wrapper: createWrapper(),
    });
    expect(result.current.invalidateSearch).toBeDefined();
    expect(result.current.invalidateDetails).toBeDefined();
  });
});
