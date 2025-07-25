import type { Animals } from '../search/search.interfaces';
import type { JSX } from 'react';

export function renderAnimalsCards(result: Animals[]): JSX.Element[] {
  return result.map((animal) => (
    <ul key={animal.uid} className="card">
      <li className="card-item animal-name">{animal.name}</li>
      <li className="card-item">
        Avian:{' '}
        <span className="animal-propertyes">{animal.avian ? 'yes' : 'no'}</span>
      </li>
      <li className="card-item">
        Earth animal:{' '}
        <span className="animal-propertyes">
          {animal.earthAnimal ? 'yes' : 'no'}
        </span>
      </li>
      <li className="card-item">
        Feline:{' '}
        <span className="animal-propertyes">
          {animal.feline ? 'yes' : 'no'}
        </span>
      </li>
    </ul>
  ));
}
