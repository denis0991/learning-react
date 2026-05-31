import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorBoundary } from '../errorBoundary';

import {
  getDefaultErrorBoundaryProps,
  ErrorThrower,
  NormalComponent,
  mockErrors,
} from '../../test-utils/error-boundary-mock';

describe('ErrorBoundary Component', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error');
  const consoleLogSpy = vi.spyOn(console, 'log');

  beforeEach(() => {
    consoleErrorSpy.mockImplementation(() => {});
    consoleLogSpy.mockClear();
  });

  describe('When no error occurs', () => {
    test('renders children components', () => {
      render(
        <ErrorBoundary {...getDefaultErrorBoundaryProps()}>
          <NormalComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });

    test('does not show error UI', () => {
      render(
        <ErrorBoundary {...getDefaultErrorBoundaryProps()}>
          <NormalComponent />
        </ErrorBoundary>
      );

      expect(
        screen.queryByRole('button', { name: 'Reset error' })
      ).not.toBeInTheDocument();
    });
  });

  describe('When error occurs', () => {
    test('displays error message', () => {
      render(
        <ErrorBoundary {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower
            shouldThrow={true}
            errorMessage="Custom error message"
          />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    test('shows reset button', () => {
      render(
        <ErrorBoundary {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByRole('button', { name: 'Reset error' })
      ).toBeInTheDocument();
    });
  });

  describe('Reset functionality', () => {
    test('resets error when reset button is clicked', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <ErrorBoundary key="error" {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower shouldThrow={true} errorMessage="Test error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Reset error' }));

      rerender(
        <ErrorBoundary key="normal" {...getDefaultErrorBoundaryProps()}>
          <NormalComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('getDerivedStateFromError', () => {
    test('captures error message', () => {
      const state = ErrorBoundary.getDerivedStateFromError(mockErrors.simple);

      expect(state).toEqual({
        hasError: true,
        errorMessage: 'Test error',
      });
    });

    test('captures empty error message', () => {
      const state = ErrorBoundary.getDerivedStateFromError(mockErrors.empty);

      expect(state).toEqual({
        hasError: true,
        errorMessage: '',
      });
    });
  });

  describe('componentDidCatch lifecycle', () => {
    test('logs error to console', () => {
      render(
        <ErrorBoundary {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower shouldThrow={true} errorMessage="Test error" />
        </ErrorBoundary>
      );

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test error');
    });
  });

  describe('resetError method', () => {
    test('resetError clears error state', () => {
      const errorBoundaryRef = React.createRef<ErrorBoundary>();

      const { rerender } = render(
        <ErrorBoundary
          key="error"
          ref={errorBoundaryRef}
          {...getDefaultErrorBoundaryProps()}
        >
          <ErrorThrower shouldThrow={true} errorMessage="Test error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();

      errorBoundaryRef.current?.resetError();

      rerender(
        <ErrorBoundary key="normal" {...getDefaultErrorBoundaryProps()}>
          <NormalComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('Multiple errors handling', () => {
    test('shows first error then second error after reset', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <ErrorBoundary key="first-error" {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower shouldThrow={true} errorMessage="First error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('First error')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Reset error' }));

      rerender(
        <ErrorBoundary key="reset" {...getDefaultErrorBoundaryProps()}>
          <div>Reset state</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Reset state')).toBeInTheDocument();

      rerender(
        <ErrorBoundary key="second-error" {...getDefaultErrorBoundaryProps()}>
          <ErrorThrower shouldThrow={true} errorMessage="Second error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Second error')).toBeInTheDocument();
    });
  });
});
