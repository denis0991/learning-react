import { Link, useSearchParams } from 'react-router-dom';
import type { JSX } from 'react';
import './not-found.styles.css';

export function NotFound(): JSX.Element {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  return (
    <section className="not-found">
      <div className="not-found__container">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__message">
          The page you are looking for does not exist or has been moved to
          another sector of the galaxy. Please check your coordinates and try
          again.
        </p>
        <Link to={`/?page=${page}`} className="not-found__button">
          Return to Main Page
        </Link>
      </div>
    </section>
  );
}
