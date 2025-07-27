import type { ReactElement } from 'react';

export function NotFound(): ReactElement {
  return (
    <section>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </section>
  );
}
