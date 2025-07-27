import { render, screen } from '@testing-library/react';
import { describe, expect, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { App } from '../App';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

function renderAppWithRouter(initialPath = '/search') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
}

describe('App with localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should load saved search value from localStorage into input field', async () => {
    localStorage.setItem('request', JSON.stringify('Abalone'));
    renderAppWithRouter();
    const input: HTMLInputElement =
      await screen.findByPlaceholderText('search..');
    expect(input).toHaveValue('Abalone');
  });

  test('should update input value when user types', async () => {
    const user = userEvent.setup();
    renderAppWithRouter();
    const input: HTMLInputElement =
      await screen.findByPlaceholderText('search..');
    await user.clear(input);
    await user.type(input, 'Owon');

    expect(input).toHaveValue('Owon');
  });
  test('should save input value to localStorage on search button click', async () => {
    const user = userEvent.setup();

    renderAppWithRouter();

    const input = await screen.findByPlaceholderText('search..');
    const button = await screen.findByRole('button', { name: /Search/i });

    await user.clear(input);
    await user.type(input, 'Abalone');
    await user.click(button);

    const saved = localStorage.getItem('request');
    expect(saved).toBe(JSON.stringify('Abalone'));
  });
});
