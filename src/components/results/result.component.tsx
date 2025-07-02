import React, { type ReactNode } from 'react';
import { Card } from './card.component';

interface PropsType {
  result: React.ReactElement;
}

export class Result extends React.Component<PropsType> {
  render(): ReactNode {
    return (
      <section className="result">
        <h2>Results</h2>
        <Card result={this.props.result}></Card>
      </section>
    );
  }
}
