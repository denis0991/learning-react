import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Card } from './card.component';
import type { Animals } from '../search/search.interfaces';

const mockAnimals: Animals[] = [
  {
    uid: 'ANMA0000032315',
    name: "'Owon",
    earthAnimal: true,
    earthInsect: false,
    avian: false,
    canine: false,
    feline: false,
  },
  {
    uid: 'ANMA0000264633',
    name: 'Abalone',
    earthAnimal: true,
    earthInsect: false,
    avian: true,
    canine: false,
    feline: false,
  },
];

describe('when there is data', () => {
  test('should render correct animal', () => {
    render(<Card result={mockAnimals} lackOfResult={false}></Card>);
    const cards: HTMLElement[] = screen.getAllByRole('list');
    expect(cards).toHaveLength(mockAnimals.length);
  });
  test('should render animal names correctly', () => {
    render(<Card result={mockAnimals} lackOfResult={false}></Card>);
    const element: HTMLElement = screen.getByText(/Owon/i);
    expect(element).toBeInTheDocument();
  });
  test('should render animal names correctly', () => {
    render(<Card result={mockAnimals} lackOfResult={false}></Card>);
    const element: HTMLElement = screen.getByText(/Abalone/i);
    expect(element).toBeInTheDocument();
  });
  test('should render animal properties correctly (yes/no)', () => {
    render(<Card result={mockAnimals} lackOfResult={false}></Card>);
    const avianYes: HTMLElement[] = screen.getAllByText(
      (_, element) => element?.textContent === `Avian: yes`
    );
    expect(avianYes).toHaveLength(1);
    const avianNo: HTMLElement[] = screen.getAllByText(
      (_, element) => element?.textContent === `Avian: no`
    );
    expect(avianNo).toHaveLength(1);
    const earthAnimalYes: HTMLElement[] = screen.getAllByText(
      (_, element) => element?.textContent === `Earth animal: yes`
    );
    expect(earthAnimalYes).toHaveLength(2);
    const felineNo: HTMLElement[] = screen.getAllByText(
      (_, element) => element?.textContent === `Feline: no`
    );
    expect(felineNo).toHaveLength(2);
  });
});

describe('when nothing is found', () => {
  test('should render nothing found', () => {
    render(<Card result={mockAnimals} lackOfResult={true}></Card>);
    const element = screen.getByText(/Nothing found/i);
    expect(element).toBeInTheDocument();
  });
});
