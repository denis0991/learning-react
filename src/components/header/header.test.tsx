import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './header.component';

describe('Header component', () => {
  test('should display a header with h1 heading', () => {
    render(<Header />);
    const h1 = screen.getByRole('heading', {
      level: 1,
      name: /Star Trek/i,
    });
    expect(h1).toBeInTheDocument();
  });

  test('should display a header with h2 heading', () => {
    render(<Header />);
    const h2 = screen.getByRole('heading', {
      level: 2,
      name: /Animals/i,
    });
    expect(h2).toBeInTheDocument();
  });
});
