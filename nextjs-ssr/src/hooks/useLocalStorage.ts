'use client';

import { useEffect, useRef } from 'react';
import { useAnimalStore } from '../stores/useAnimalStore';


export const useLocalStorage = () => {
  const { inputValue, setInputValue } = useAnimalStore();
  const hasInitialSearch = useRef(false);

  useEffect(() => {
    if (hasInitialSearch.current) return;

    try {
      const savedValue = localStorage.getItem('request');
      if (savedValue) {
        const parsedValue = JSON.parse(savedValue);
        setInputValue(parsedValue);
        hasInitialSearch.current = true;
      } else {
        hasInitialSearch.current = true;
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      hasInitialSearch.current = true;
    }
  }, [setInputValue]);

  useEffect(() => {
    try {
      localStorage.setItem('request', JSON.stringify(inputValue));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [inputValue]);
};
