import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Card } from '../card.component';
import type { Animals } from '../../search/search.interfaces';
import { mockAnimals } from '../../../test-utils/search-mocks';
import { TestWrapper } from '../../../test-utils/test-wrapper';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' }),
  };
});

vi.mock('../../../stores/selectionStore', () => ({
  useSelectionStore: () => ({
    toggleSelection: vi.fn(),
    isSelected: vi.fn().mockReturnValue(false),
  }),
}));

describe('Card component', () => {
  test('renders animal name correctly', () => {
    render(
      <TestWrapper>
        <Card {...mockAnimals[0]} />
      </TestWrapper>
    );
    expect(screen.getByText('Lion')).toBeInTheDocument();
  });

  test('displays "yes" for true properties', () => {
    render(
      <TestWrapper>
        <Card {...mockAnimals[0]} />
      </TestWrapper>
    );
    const yesElements = screen.getAllByText('yes');
    expect(yesElements).toHaveLength(2);
    expect(yesElements[0]).toBeInTheDocument();
    expect(yesElements[1]).toBeInTheDocument();
  });

  test('displays "no" for false properties', () => {
    const bird: Animals = {
      uid: '2',
      name: 'Eagle',
      avian: true,
      earthAnimal: false,
      feline: false,
      earthInsect: false,
      canine: false,
      json: function () {
        throw new Error('Function not implemented.');
      },
      selectedAt: Date.now(),
    };
    render(
      <TestWrapper>
        <Card {...bird} />
      </TestWrapper>
    );
    const noElements = screen.getAllByText('no');
    expect(noElements).toHaveLength(2);
  });

  test('has correct CSS classes', () => {
    render(
      <TestWrapper>
        <Card {...mockAnimals[2]} />
      </TestWrapper>
    );
    const card = document.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(document.querySelector('.animal-name')).toHaveTextContent(
      mockAnimals[2].name
    );
    const properties = document.querySelectorAll('.animal-properties');
    expect(properties).toHaveLength(3);
  });
  test('renders checkbox', () => {
    render(
      <TestWrapper>
        <Card {...mockAnimals[0]} />
      </TestWrapper>
    );
    const checkbox = document.querySelector('.card-checkbox');
    expect(checkbox).toBeInTheDocument();
  });
  test('navigates to details on card click', () => {
    render(
      <TestWrapper>
        <Card {...mockAnimals[0]} />
      </TestWrapper>
    );
    const card = document.querySelector('.card');
    if (!card) {
      throw new Error('Card element not found');
    }
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
