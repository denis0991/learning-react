/* eslint-disable react-refresh/only-export-components */
import { vi } from 'vitest';
import type { Props, State } from '../errorBoundary/error.types';
import React, { type JSX, type ReactNode } from 'react';

export const getDefaultErrorBoundaryProps = (
  overrides: Partial<Props> = {}
): Props => ({
  children: null,
  resetTrigger: 0,
  ...overrides,
});

export const getInitialState = (): State => ({
  hasError: false,
  errorMessage: '',
  errorInfo: null,
});

export const getErrorState = (errorMessage: string = 'Test error'): State => ({
  hasError: true,
  errorMessage,
  errorInfo: null,
});

export const mockLogErrorToServices = vi.fn();

export class ErrorThrower extends React.Component<{
  shouldThrow?: boolean;
  errorMessage?: string;
}> {
  render(): ReactNode {
    if (this.props.shouldThrow) {
      throw new Error(this.props.errorMessage || 'Test error');
    }
    return <div>Normal content</div>;
  }
}

export const NormalComponent = (): JSX.Element => <div>Working component</div>;

export const mockErrors = {
  simple: new Error('Test error'),
  network: new Error('Network error'),
  api: new Error('API returned 500'),
  empty: new Error(''),
};

export const mockComponentStack = `
  at ErrorThrower (src/test-utils/error-boundary-mocks.ts:15:11)
  at ErrorBoundary (src/components/error-boundary/error-boundary.component.tsx:18:5)
`;
