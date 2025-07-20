import { render, screen } from '@testing-library/react';
import { describe, expect, test, beforeEach } from 'vitest';
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
});
