import { renderHook, act } from '@testing-library/react';
import { useAnimalStore } from '../useAnimalStore';
import type { Animals } from '../../components/search/search.interfaces';

describe('useAnimalStore', () => {
  it('should set input value', () => {
    const { result } = renderHook(() => useAnimalStore());
    act(() => {
      result.current.setInputValue('test');
    });
    expect(result.current.inputValue).toBe('test');
  });

  it('should set search state', () => {
    const { result } = renderHook(() => useAnimalStore());
    const animals: Animals[] = [{ uid: '1', name: 'Lion' } as Animals];

    act(() => {
      result.current.setSearchState(animals, 5);
    });

    expect(result.current.result).toEqual(animals);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentPage).toBe(1);
  });

  it('should reset page', () => {
    const { result } = renderHook(() => useAnimalStore());

    act(() => {
      result.current.setCurrentPage(5);
      result.current.resetPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should set status', () => {
    const { result } = renderHook(() => useAnimalStore());

    act(() => {
      result.current.setStatus('searching');
    });

    expect(result.current.status).toBe('searching');
  });

  it('should set error message', () => {
    const { result } = renderHook(() => useAnimalStore());

    act(() => {
      result.current.setErrorMessage('Test error');
    });

    expect(result.current.errorMessage).toBe('Test error');
  });
});
