import { type JSX } from 'react';
import type { Animals } from '../search/search.interfaces';

export function Card({
  name,
  avian,
  earthAnimal,
  feline,
}: Animals): JSX.Element {
  return (
    <ul className="card">
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
