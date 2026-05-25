import { useEffect, useRef } from 'react';
import { useAnimalStore } from '../stores/animal.store';
import { useAnimalSearch } from './useAnimalSearch';

export const useLocalStorage = () => {
  const { inputValue, setInputValue } = useAnimalStore();
  const { searchAnimals } = useAnimalSearch();
  const hasInitialSearch = useRef(false);

  useEffect(() => {
    if (hasInitialSearch.current) return;

    try {
      const savedValue = localStorage.getItem('request');
      if (savedValue) {
        const parsedValue = JSON.parse(savedValue);
        setInputValue(parsedValue);
        searchAnimals(parsedValue, 1);
        hasInitialSearch.current = true;
      } else {
        searchAnimals('', 1);
        hasInitialSearch.current = true;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      searchAnimals('', 1);
      hasInitialSearch.current = true;
    }
  }, [setInputValue, searchAnimals]);

  useEffect(() => {
    try {
      localStorage.setItem('request', JSON.stringify(inputValue));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [inputValue]);
};
