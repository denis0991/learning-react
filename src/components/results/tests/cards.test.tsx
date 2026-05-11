import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cards } from '../cards.component';
import type { Animals } from '../../search/search.interfaces';

vi.mock('../card.component', () => ({
  Card: ({ animal }: { animal: Animals }) => (
    <div data-testid="mock-card">{animal.name}</div>
  ),
}));

describe('Cards component', () => {
  const mockResults: Animals[] = [
    {
      uid: '1',
      name: 'Lion',
      avian: false,
      earthAnimal: true,
      feline: true,
      earthInsect: false,
      canine: false,
    },
    {
      uid: '2',
      name: 'Eagle',
      avian: true,
      earthAnimal: false,
      feline: false,
      earthInsect: false,
      canine: false,
    },
  ];

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
      expect(screen.getByText('⚠️')).toBeInTheDocument();
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
          result={mockResults}
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
          result={mockResults}
          lackOfResult={false}
          searchError={false}
          errorMessage=""
        />
      );
      const cards = screen.getAllByTestId('mock-card');
      expect(cards).toHaveLength(2);
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
