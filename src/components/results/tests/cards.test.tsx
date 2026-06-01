import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cards } from '../cards.component';
import type { Animals } from '../../search/search.interfaces';
import { mockAnimals } from '../../../test-utils/search-mocks';

vi.mock('../card.component', () => ({
  Card: (props: Animals) => <div data-testid="mock-card">{props.name}</div>,
}));
describe('Cards component', () => {
  describe('when searchError is true', () => {
    test('displays error message', () => {
      render(
        <Cards
          result={[]}
          lackOfResult={false}
          searchError={true}
          errorMessage="Custom error"
        />
      );
      expect(screen.getByText('Custom error')).toBeInTheDocument();
    });

    test('displays default error message when none provided', () => {
      render(
        <Cards
          result={[]}
          lackOfResult={false}
          searchError={true}
          errorMessage=""
        />
      );
      expect(
        screen.getByText('Something went wrong. Please try again later.')
      ).toBeInTheDocument();
    });
  });

  describe('when lackOfResult is false (has results)', () => {
    test('renders cards container', () => {
      render(
        <Cards
          result={mockAnimals}
          lackOfResult={false}
          searchError={false}
          errorMessage=""
        />
      );
      expect(document.querySelector('.card-container')).toBeInTheDocument();
    });

    test('renders correct number of cards', () => {
      render(
        <Cards
          result={mockAnimals}
          lackOfResult={false}
          searchError={false}
          errorMessage=""
        />
      );
      const cards = screen.getAllByTestId('mock-card');
      expect(cards).toHaveLength(3);
      expect(screen.getByText('Lion')).toBeInTheDocument();
      expect(screen.getByText('Eagle')).toBeInTheDocument();
    });
  });

  describe('when lackOfResult is true (no results)', () => {
    test('displays "Nothing found" message', () => {
      render(
        <Cards
          result={[]}
          lackOfResult={true}
          searchError={false}
          errorMessage=""
        />
      );
      expect(screen.getByText('Nothing found')).toBeInTheDocument();
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });
  });
});
