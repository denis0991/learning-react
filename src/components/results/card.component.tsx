import React, { type ReactNode } from 'react';

interface PropsCard {
  result: React.ReactElement;
}

export class Card extends React.Component<PropsCard> {
  render(): ReactNode {
    return <div className="card-container">{this.props.result}</div>;
  }
}
