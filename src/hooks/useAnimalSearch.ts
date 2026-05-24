import { useCallback } from 'react';
import { useAnimalStore } from '../stores/animal.store';

export const useAnimalSearch = () => {
  const {
    setSearchState,
    setStatus,
    setLackOfResult,
    setSearchError,
    setErrorMessage,
  } = useAnimalStore();

  const searchAnimals = useCallback(
    async (searchValue: string, page: number = 1) => {
      const queryValue = searchValue.trim();

      setStatus('searching');
      setLackOfResult(false);
      setSearchError(false);
      setErrorMessage('');

      try {
        const response = await fetch(
          `https://stapi.co/api/v1/rest/animal/search?pageNumber=${page - 1}&pageSize=12`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(queryValue)}`,
          }
        );

        const data = await response.json();

        if (data.animals) {
          setSearchState(data.animals, data.page?.totalPages);
          setStatus(data.animals.length === 0 ? 'missing' : 'success');
          setLackOfResult(data.animals.length === 0);
        } else if (data.error) {
          setStatus('error');
          setSearchError(true);
          setErrorMessage(data.error);
        }
      } catch (error) {
        console.error('Search error:', error);
        setStatus('error');
        setSearchError(true);
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
    [
      setSearchState,
      setStatus,
      setLackOfResult,
      setSearchError,
      setErrorMessage,
    ]
  );

  return { searchAnimals };
};
