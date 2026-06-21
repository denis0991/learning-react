import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestWrapper } from './test-utils/test-wrapper';

import { mockSearch, mocks } from './test-utils/app-mocks';

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

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(screen.getByText('Header component')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('search..')).toBeInTheDocument();
    expect(screen.getByText('Result component')).toBeInTheDocument();
  });

  test('loads initial value from localStorage', async () => {
    const { App } = await import('./App');

    localStorage.setItem('request', JSON.stringify('lion'));

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    expect(localStorage.getItem).toHaveBeenCalledWith('request');
  });

  test('updates input value state', async () => {
    const { App } = await import('./App');

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    const searchProps = mockSearch.mock.calls[0][0];

    searchProps.setInputValue('tiger');

    await waitFor(() => {
      const updatedProps =
        mockSearch.mock.calls[mockSearch.mock.calls.length - 1][0];

      expect(updatedProps.value).toBe('tiger');
    });
  });

  test('shows not found page for invalid route', async () => {
    const { App } = await import('./App');

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
  });
});
