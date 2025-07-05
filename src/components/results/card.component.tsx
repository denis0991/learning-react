import React, { type ReactNode } from 'react';
import type { PropsCard } from './result.types';

export class Card extends React.Component<PropsCard> {
  render(): ReactNode {
    return <div className="card-container">{this.props.result}</div>;
  }
}
