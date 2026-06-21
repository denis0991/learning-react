import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Search } from '../search.component';
import type { Status } from '../search.interfaces';
import { getDefaultSearchProps } from '../../../test-utils/search-mocks';

describe('Search component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const defaultProps = {
    ...getDefaultSearchProps(),
    onSearch: vi.fn(),
  };

  const renderSearch = (props: Partial<typeof defaultProps> = {}) =>
    render(<Search {...defaultProps} {...props} />);

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
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
      ['searching', '.searching-loader'],
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
    });

    test('starts search when Enter key is pressed', async () => {
      renderSearch({ value: 'dog' });
      const input = screen.getByPlaceholderText('search..');
      await user.type(input, '{Enter}');
      expect(defaultProps.onSearch).toHaveBeenCalledWith('dog');
    });

    test('clears results when input becomes empty', async () => {
      renderSearch({ value: 'test' });
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      expect(defaultProps.setSearchState).toHaveBeenCalledWith([], 0);
      expect(defaultProps.setStatus).toHaveBeenCalledWith('default');
    });
  });

  describe('Edge cases', () => {
    test('handles empty trimmed value', async () => {
      renderSearch({ value: '   ' });
      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(defaultProps.onSearch).toHaveBeenCalledWith('   ');
    });
  });
});
