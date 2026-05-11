import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Search } from '../search.component';
import type { Status } from '../search.interfaces';
import {
  mockFetch,
  getDefaultSearchProps,
  mockApiResponses,
  mockAnimalsData,
} from '../../../test-utils/mocks';

describe('Search component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const defaultProps = getDefaultSearchProps();

  const renderSearch = (props: Partial<typeof defaultProps> = {}) =>
    render(<Search {...defaultProps} {...props} />);

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    mockFetch.mockReset();
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Rendering', () => {
    test('renders input and button', () => {
      renderSearch();
      expect(screen.getByPlaceholderText('search..')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Search' })
      ).toBeInTheDocument();
    });

    test('renders value from props', () => {
      renderSearch({ value: 'lion' });
      expect(screen.getByPlaceholderText('search..')).toHaveValue('lion');
    });

    test('does not show clear button when input is empty', () => {
      renderSearch();
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    test('shows clear button when input has value', () => {
      renderSearch({ value: 'lion' });
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });
  });

  describe('Status rendering', () => {
    const statusCases: Array<[Status, string]> = [
      ['default', '.default'],
      ['search', '.loader'],
      ['success', '.success'],
      ['missing', '.missing'],
      ['error', '.missing'],
    ];

    test.each(statusCases)(
      'renders correct UI for "%s" status',
      (status, selector) => {
        renderSearch({ status });
        expect(document.querySelector(selector)).toBeInTheDocument();
      }
    );
  });

  describe('User interactions', () => {
    test('calls setInputValue when typing in input', async () => {
      renderSearch();
      const input = screen.getByPlaceholderText('search..');
      await user.type(input, 'eagle');
      expect(defaultProps.setInputValue).toHaveBeenCalledTimes(5);
      expect(defaultProps.setInputValue).toHaveBeenLastCalledWith('e');
    });

    test('clears input', async () => {
      renderSearch({ value: 'lion' });
      await user.click(screen.getByLabelText('Clear search'));
      expect(defaultProps.setInputValue).toHaveBeenCalledWith('');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'request',
        JSON.stringify('')
      );
    });

    test('starts search', async () => {
      renderSearch({ value: 'cat' });
      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(defaultProps.setStatus).toHaveBeenCalledWith('search');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'request',
        JSON.stringify('cat')
      );
    });
  });

  describe('API calls', () => {
    test('fetches animals on mount', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponses.success());
      renderSearch();
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://stapi.co/api/v1/rest/animal/search?pageNumber=0&pageSize=12',
          expect.objectContaining({
            method: 'POST',
            body: 'name=',
          })
        );
      });
    });

    test('handles successful response', async () => {
      const animals = mockAnimalsData.single;
      mockFetch.mockResolvedValueOnce(mockApiResponses.success(animals));
      renderSearch();
      await waitFor(() => {
        expect(defaultProps.setStatus).toHaveBeenCalledWith('success');
        expect(defaultProps.setSearchState).toHaveBeenCalledWith(animals);
        expect(defaultProps.setError).toHaveBeenCalledWith(false);
        expect(defaultProps.setSearchError).toHaveBeenCalledWith(false);
      });
    });

    test('handles empty response', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponses.empty());
      renderSearch();
      await waitFor(() => {
        expect(defaultProps.setStatus).toHaveBeenCalledWith('missing');
        expect(defaultProps.setError).toHaveBeenCalledWith(true);
      });
    });

    test('handles http error', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponses.httpError(500));
      renderSearch();
      await waitFor(() => {
        expect(defaultProps.setStatus).toHaveBeenCalledWith('error');
        expect(defaultProps.setSearchError).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Error handling', () => {
    const errorCases: Array<[string, string]> = [
      [
        'Failed to fetch',
        'Unable to connect to search service. Please check your network connection.',
      ],
      [
        'CORS error',
        'Unable to connect to search service. Please check your network connection.',
      ],
      ['Unknown error', 'Something went wrong. Please try again later.'],
    ];

    test.each(errorCases)('handles "%s"', async (error, expectedMessage) => {
      mockFetch.mockRejectedValueOnce(mockApiResponses.networkError(error));
      renderSearch();
      await waitFor(() => {
        expect(defaultProps.setStatus).toHaveBeenCalledWith('error');
        expect(defaultProps.setSearchError).toHaveBeenCalledWith(true);
        expect(defaultProps.setErrorMessage).toHaveBeenCalledWith(
          expectedMessage
        );
      });
    });
  });

  describe('Edge cases', () => {
    test('handles empty trimmed value', async () => {
      renderSearch({ value: '   ' });
      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(defaultProps.setStatus).toHaveBeenCalled();
    });

    test('prevents duplicate search requests', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponses.success());
      const { rerender } = renderSearch({ value: 'lion' });
      const button = screen.getByRole('button', { name: 'Search' });

      await user.click(button);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      rerender(<Search {...getDefaultSearchProps({ value: 'lion' })} />);
      await user.click(button);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
