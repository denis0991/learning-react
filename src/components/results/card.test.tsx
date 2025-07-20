import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Card } from './card.component';
import { MockAnimals } from './test.constants';

describe('when there is data', () => {
  test('should render correct animal', () => {
    render(<Card result={MockAnimals} lackOfResult={false}></Card>);
    const cards: HTMLElement[] = screen.getAllByRole('list');
    expect(cards).toHaveLength(MockAnimals.length);
  });
  test('should render animal names correctly', () => {
    render(<Card result={MockAnimals} lackOfResult={false}></Card>);
    const element: HTMLElement = screen.getByText(/Owon/i);
    expect(element).toBeInTheDocument();
  });
  test('should render animal names correctly', () => {
    render(<Card result={MockAnimals} lackOfResult={false}></Card>);
    const element: HTMLElement = screen.getByText(/Abalone/i);
    expect(element).toBeInTheDocument();
  });
  test('should render animal properties correctly (yes/no)', () => {
    render(<Card result={MockAnimals} lackOfResult={false}></Card>);
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
    render(<Card result={MockAnimals} lackOfResult={true}></Card>);
    const element = screen.getByText(/Nothing found/i);
    expect(element).toBeInTheDocument();
  });
});
