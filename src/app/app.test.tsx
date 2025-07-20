import { render, screen } from '@testing-library/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { App } from '../App';
import userEvent from '@testing-library/user-event';

describe('App with localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should load saved search value from localStorage into input field', () => {
    localStorage.setItem('request', JSON.stringify('Abalone'));
    render(<App />);
    const input: HTMLInputElement = screen.getByPlaceholderText('search..');
    expect(input.value).toBe('Abalone');
  });

  test('should update input value when user types', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input: HTMLInputElement = screen.getByPlaceholderText('search..');
    await user.clear(input);
    await user.type(input, 'Owon');

    expect(input.value).toBe('Owon');
  });
  test('should save input value to localStorage on search button click', async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByPlaceholderText('search..');
    const button = screen.getByRole('button', { name: /Search/i });

    await user.clear(input);
    await user.type(input, 'Abalone');
    await user.click(button);

    const saved = localStorage.getItem('request');
    expect(saved).toBe(JSON.stringify('Abalone'));
  });
});
