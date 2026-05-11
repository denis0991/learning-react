import React from 'react';
import type { Animals } from '../index';
import { vi } from 'vitest';

export const mockSearch = vi.fn();
export const mockResult = vi.fn();
export const mockErrorBoundary = vi.fn();

export const mocks = {
  Search: (props: {
    value: string;
    setInputValue: (value: string) => void;
    setSearchState: (animals: Animals[]) => void;
    setStatus: (status: string) => void;
    setErrorMessage?: (message: string) => void;
    setError?: (status: boolean) => void;
    setSearchError?: (status: boolean) => void;
  }) => {
    mockSearch(props);

    return (
      <input
        placeholder="search.."
        value={props.value}
        onChange={(e) => props.setInputValue(e.target.value)}
      />
    );
  },

  Result: (props: unknown) => {
    mockResult(props);
    return <div>Result component</div>;
  },

  ErrorBoundary: (props: {
    children: React.ReactNode;
    resetTrigger: number;
  }) => {
    mockErrorBoundary(props);
    return <div>{props.children}</div>;
  },

  Header: () => <div>Header component</div>,
};
