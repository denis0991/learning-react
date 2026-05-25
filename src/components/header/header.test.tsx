import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Header } from './header.component';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/theme-context';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </MemoryRouter>
  );
};

describe('Header component', () => {
  test('should display a header with h1 heading', () => {
    renderWithTheme(<Header />);
    const h1 = screen.getByRole('heading', {
      level: 1,
      name: /Star Trek/i,
    });
    expect(h1).toBeInTheDocument();
  });

  test('should display a header with h2 heading', () => {
    renderWithTheme(<Header />);
    const h2 = screen.getByRole('heading', {
      level: 2,
      name: /Animals/i,
    });
    expect(h2).toBeInTheDocument();
  });
});
