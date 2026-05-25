import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../pagination.component';
import { vi } from 'vitest';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  it('Does not render with totalPages <= 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders navigation buttons', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('« Prev')).toBeInTheDocument();
    expect(screen.getByText('Next »')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('3')).toHaveClass('active');
  });

  it('calls onPageChange when clicking on a page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('5'));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('blocks Prev on the first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('« Prev')).toBeDisabled();
  });

  it('blocks Next on the last page', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Next »')).toBeDisabled();
  });
});
