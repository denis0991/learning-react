import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../card.component';
import type { Animals } from '../../search/search.interfaces';

describe('Card component', () => {
  const mockAnimal: Animals = {
    uid: '1',
    name: 'Lion',
    avian: false,
    earthAnimal: true,
    feline: true,
    earthInsect: false,
    canine: false,
  };

  test('renders animal name correctly', () => {
    render(<Card animal={mockAnimal} />);
    expect(screen.getByText('Lion')).toBeInTheDocument();
  });

  test('displays "yes" for true properties', () => {
    render(<Card animal={mockAnimal} />);
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
    };
    render(<Card animal={bird} />);
    const noElements = screen.getAllByText('no');
    expect(noElements).toHaveLength(2);
  });

  test('has correct CSS classes', () => {
    render(<Card animal={mockAnimal} />);
    const card = document.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(document.querySelector('.animal-name')).toHaveTextContent('Lion');
    const properties = document.querySelectorAll('.animal-properties');
    expect(properties).toHaveLength(3);
  });
});
