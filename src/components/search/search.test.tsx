import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Search } from './search.component';
import type { Props } from './search.interfaces';

describe('Search input field', () => {
  test('should render input and allow typing', async () => {
    const props: Props = {
      value: '',
      status: 'default',
      setStatus: vi.fn(),
      setError: vi.fn(),
      setSearchError: vi.fn(),
      setSearchState: vi.fn(),
    };

    render(<Search {...props} />);

    const input = screen.getByPlaceholderText('search..');
    expect(input).toBeInTheDocument();

    await userEvent.type(input, 'Abalone');
    expect((input as HTMLInputElement).value).toBe('Abalone');
  });
});
