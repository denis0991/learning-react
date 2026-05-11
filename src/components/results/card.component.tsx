import React, { type ReactNode } from 'react';
import type { AnimalCardProps } from './result.types';

export class Card extends React.Component<AnimalCardProps> {
  render(): ReactNode {
    const { animal } = this.props;

    return (
      <ul key={animal.uid} className="card">
        <li className="card-item animal-name">{animal.name}</li>
        <li className="card-item">
          Avian:{' '}
          <span className="animal-properties">
            {animal.avian ? 'yes' : 'no'}
          </span>
        </li>
        <li className="card-item">
          Earth animal:{' '}
          <span className="animal-properties">
            {animal.earthAnimal ? 'yes' : 'no'}
          </span>
        </li>
        <li className="card-item">
          Feline:{' '}
          <span className="animal-properties">
            {animal.feline ? 'yes' : 'no'}
          </span>
        </li>
      </ul>
    );
  }
}
