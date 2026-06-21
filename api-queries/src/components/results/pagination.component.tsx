import type { ReactElement } from 'react';
import type { PaginationProps } from './result.types';
import './pagination.css';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2;

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    pages.push(1);

    if (left > 2 && totalPages > 5) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (right < totalPages - 1 && totalPages > 5) {
      pages.push('...');
    }

    if (totalPages !== 1) {
      pages.push(totalPages);
    }

    const uniquePages: (number | string)[] = [];
    for (const p of pages) {
      if (!uniquePages.includes(p)) uniquePages.push(p);
    }

    return uniquePages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        &laquo; Prev
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          className={
            typeof page === 'number' && currentPage === page ? 'active' : ''
          }
          disabled={page === '...'}
          onClick={() => typeof page === 'number' && onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        Next &raquo;
      </button>
    </div>
  );
}
