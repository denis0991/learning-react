import React, { type ReactNode } from 'react';
import type { PropsCard } from './result.types';
import type { Animals } from '../search/search.interfaces';
import { Card } from './card.component';

export class Cards extends React.Component<PropsCard> {
  render(): ReactNode {
    if (this.props.searchError) {
      return (
        <div className="error-message-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">
            {this.props.errorMessage ||
              'Something went wrong. Please try again later.'}
          </div>
        </div>
      );
    }

    if (!this.props.lackOfResult) {
      return (
        <div className="card-container">
          {this.renderAnimalsCards(this.props.result)}
        </div>
      );
    }

    return (
      <div className="empty-message-container">
        <div className="empty-icon">🔍</div>
        <div className="empty-text">Nothing found</div>
      </div>
    );
  }

  renderAnimalsCards(result: Animals[]): ReactNode {
    return result.map((animal) => <Card key={animal.uid} animal={animal} />);
  }
}
