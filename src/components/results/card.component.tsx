import React, { type ReactNode } from 'react';
import type { PropsCard } from './result.types';
import type { Animals } from '../search/search.interfaces';

export class Card extends React.Component<PropsCard> {
  render(): ReactNode {
    if (!this.props.lackOfResult) {
      return (
        <div className="card-container">
          {this.renderAnimalsCards(this.props.result)}
        </div>
      );
    }
    return <div>Nothing found</div>;
  }

  renderAnimalsCards(result: Animals[]): ReactNode {
    return result.map((animal) => (
      <ul key={animal.uid} className="card">
        <li className="card-item">{animal.name}</li>
        <li className="card-item">{animal.uid}</li>
        <li className="card-item">Avian: {animal.avian ? 'yes' : 'no'}</li>
        <li className="card-item">
          Earth animal: {animal.earthAnimal ? 'yes' : 'no'}
        </li>
        <li className="card-item">Feline: {animal.feline ? 'yes' : 'no'}</li>
      </ul>
    ));
  }
}
