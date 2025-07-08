import React, { type ReactNode } from 'react';
import type { PropsCard } from './result.types';
import type { Animals } from '../search/search.interfaces';
import './card.styles.css';
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
        <li className="card-item animal-name">{animal.name}</li>
        <li className="card-item">
          Avian:{' '}
          <span className="animal-propertyes">
            {animal.avian ? 'yes' : 'no'}
          </span>
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
}
