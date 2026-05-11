import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { Animals } from './index';

import {
  mockSearch,
  mockResult,
  mockErrorBoundary,
  mocks,
} from './test-utils/app-mocks';

vi.mock('./index', async () => {
  const actual = await vi.importActual<typeof import('./index')>('./index');

  return {
    ...actual,
    ...mocks,
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders all main components', async () => {
    const { App } = await import('./App');

    render(<App />);

    expect(screen.getByText('Header component')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('search..')).toBeInTheDocument();
    expect(screen.getByText('Result component')).toBeInTheDocument();
  });

  test('loads initial value from localStorage', async () => {
    const { App } = await import('./App');

    localStorage.setItem('request', JSON.stringify('lion'));

    render(<App />);

    expect(localStorage.getItem).toHaveBeenCalledWith('request');
  });

  test('updates input value state', async () => {
    const { App } = await import('./App');

    render(<App />);

    const searchProps = mockSearch.mock.calls[0][0];

    searchProps.setInputValue('tiger');

    await waitFor(() => {
      const updatedProps =
        mockSearch.mock.calls[mockSearch.mock.calls.length - 1][0];

      expect(updatedProps.value).toBe('tiger');
    });
  });

  test('updates result state', async () => {
    const { App } = await import('./App');

    render(<App />);

    const animals: Animals[] = [
      {
        uid: '1',
        name: 'Lion',
        earthAnimal: false,
        earthInsect: false,
        avian: false,
        canine: false,
        feline: false,
      },
    ];

    const searchProps = mockSearch.mock.calls[0][0];

    searchProps.setSearchState(animals);

    await waitFor(() => {
      const resultProps =
        mockResult.mock.calls[mockResult.mock.calls.length - 1][0];

      expect(resultProps.result).toEqual(animals);
    });
  });

  test('updates status and resets error boundary', async () => {
    const { App } = await import('./App');

    render(<App />);

    const initialProps = mockErrorBoundary.mock.calls[0][0];

    const searchProps = mockSearch.mock.calls[0][0];

    searchProps.setStatus('success');

    await waitFor(() => {
      const updatedProps =
        mockErrorBoundary.mock.calls[
          mockErrorBoundary.mock.calls.length - 1
        ][0];

      expect(updatedProps.resetTrigger).toBe(initialProps.resetTrigger + 1);
    });
  });

  test('sets error message', async () => {
    const { App } = await import('./App');

    render(<App />);

    const searchProps = mockSearch.mock.calls[0][0];

    searchProps.setErrorMessage('Test error message');

    await waitFor(() => {
      const resultProps =
        mockResult.mock.calls[mockResult.mock.calls.length - 1][0];

      expect(resultProps.errorMessage).toBe('Test error message');
    });
  });
});
