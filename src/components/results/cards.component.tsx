import React, { type ReactNode } from 'react';
import type { PropsCard } from './result.types';
import type { Animals } from '../search/search.interfaces';
import { Card } from './card.component';

export class Cards extends React.Component<PropsCard> {
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
    return result.map((animal) => <Card key={animal.uid} animal={animal} />);
  }
}
