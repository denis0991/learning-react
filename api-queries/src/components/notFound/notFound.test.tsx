import { render, screen } from '@testing-library/react';
import { NotFound } from './notFound.component';
import { MemoryRouter } from 'react-router-dom';

it('should render the title and content', () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Page Not Found'
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', '/?page=1');
});
