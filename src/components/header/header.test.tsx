import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './header.component';
import '@testing-library/jest-dom/vitest';

describe('test', () => {
  test('should display a header with h1 heading', async () => {
    render(<Header></Header>);
    const h1 = screen.getByRole('heading', {
      level: 1,
      name: /Star Trek/i,
    });
    expect(h1).toBeInTheDocument();
  });

  test('should display a header with h2 heading', async () => {
    render(<Header></Header>);
    const h1 = screen.getByRole('heading', {
      level: 2,
      name: /Animals/i,
    });
    expect(h1).toBeInTheDocument();
  });
});
