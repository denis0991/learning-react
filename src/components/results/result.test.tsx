import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Result } from './result.component';
import { MockAnimals } from './test.constants';
import { MemoryRouter } from 'react-router-dom';
const mockSearchParams = new URLSearchParams('?param1=value1&param2=value2');

describe('when the error is not active', () => {
  test('should display a title and a button', () => {
    render(
      <MemoryRouter>
        <Result
          result={MockAnimals}
          lackOfResult={false}
          searchError={false}
          searchParams={mockSearchParams}
        ></Result>
      </MemoryRouter>
    );
    const heading: HTMLElement = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Results/i);
    const button: HTMLButtonElement = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Error test/i);
  });
});
