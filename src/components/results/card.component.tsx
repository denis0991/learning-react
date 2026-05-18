import { type JSX } from 'react';
import type { Animals } from '../search/search.interfaces';
import { useLocation, useNavigate } from 'react-router-dom';

export function Card({
  uid,
  name,
  avian,
  earthAnimal,
  feline,
}: Animals): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page') || '1';
    navigate(`/details/${uid}?page=${page}`);
  };

  return (
    <ul className="card" onClick={handleClick}>
      <li className="card-item animal-name">{name}</li>
      <li className="card-item">
        Avian: <span className="animal-properties">{avian ? 'yes' : 'no'}</span>
      </li>
      <li className="card-item">
        Earth animal:{' '}
        <span className="animal-properties">{earthAnimal ? 'yes' : 'no'}</span>
      </li>
      <li className="card-item">
        Feline:{' '}
        <span className="animal-properties">{feline ? 'yes' : 'no'}</span>
      </li>
    </ul>
  );
}
