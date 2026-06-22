import { useQuery, useQueryClient } from '@tanstack/react-query';
import { animalApi } from '../services/animalApi';

export const animalKeys = {
  all: ['animals'] as const,
  search: (name: string, page: number) =>
    [...animalKeys.all, 'search', name, page] as const,
  details: (uid: string) => [...animalKeys.all, 'details', uid] as const,
};

export function useSearchAnimals(name: string, page: number) {
  return useQuery({
    queryKey: animalKeys.search(name, page),
    queryFn: () => animalApi.searchAnimals(name, page),
    enabled: false,
    staleTime: Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 300000,
    placeholderData: (previousData) => previousData,
  });
}

export function useAnimalDetails(uid: string | undefined) {
  return useQuery({
    queryKey: animalKeys.details(uid || ''),
    queryFn: () => {
      if (!uid) {
        throw new Error("Animal UID doesn't exist");
      }
      return animalApi.getAnimalDetails(uid);
    },
    enabled: !!uid,
    staleTime: Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 300000,
  });
}

export function useInvalidateAnimalCache() {
  const queryClient = useQueryClient();

  const invalidateSearch = (name?: string, page?: number) => {
    if (name && page) {
      queryClient.invalidateQueries({
        queryKey: animalKeys.search(name, page),
      });
    } else {
      queryClient.invalidateQueries({ queryKey: animalKeys.all });
    }
  };

  const invalidateDetails = (uid: string) => {
    queryClient.invalidateQueries({ queryKey: animalKeys.details(uid) });
  };

  return { invalidateSearch, invalidateDetails };
}

export function usePrefetchAnimalDetails() {
  const queryClient = useQueryClient();

  const prefetchDetails = (uid: string) => {
    queryClient.prefetchQuery({
      queryKey: animalKeys.details(uid),
      queryFn: () => animalApi.getAnimalDetails(uid),
      staleTime: Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 300000,
    });
  };

  return prefetchDetails;
}
