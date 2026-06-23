import { render, screen, fireEvent } from '@testing-library/react';
import { RefreshButton } from '../refreshButton';
import { vi } from 'vitest';

describe('RefreshButton', () => {
  it('should render button', () => {
    render(<RefreshButton onRefresh={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onRefresh when clicked', async () => {
    const mockRefresh = vi.fn().mockResolvedValue(undefined);
    render(<RefreshButton onRefresh={mockRefresh} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
