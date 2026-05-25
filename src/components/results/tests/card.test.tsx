import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../card.component';
import type { Animals } from '../../search/search.interfaces';
import { mockAnimals } from '../../../test-utils/search-mocks';
import { MemoryRouter } from 'react-router-dom';

describe('Card component', () => {
  test('renders animal name correctly', () => {
    render(
      <MemoryRouter>
        <Card {...mockAnimals[0]} />
      </MemoryRouter>
    );
    expect(screen.getByText('Lion')).toBeInTheDocument();
  });

  test('displays "yes" for true properties', () => {
    render(
      <MemoryRouter>
        <Card {...mockAnimals[0]} />
      </MemoryRouter>
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
    };
    render(
      <MemoryRouter>
        <Card {...bird} />
      </MemoryRouter>
    );
    const noElements = screen.getAllByText('no');
    expect(noElements).toHaveLength(2);
  });

  test('has correct CSS classes', () => {
    render(
      <MemoryRouter>
        <Card {...mockAnimals[2]} />
      </MemoryRouter>
    );
    const card = document.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(document.querySelector('.animal-name')).toHaveTextContent(
      mockAnimals[2].name
    );
    const properties = document.querySelectorAll('.animal-properties');
    expect(properties).toHaveLength(3);
  });
});
