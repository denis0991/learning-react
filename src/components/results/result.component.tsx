import React, { type ReactNode } from 'react';
import { Card } from './card.component';
import type { PropsType, ResultState } from './result.types';

export class Result extends React.Component<PropsType, ResultState> {
  constructor(props: PropsType) {
    super(props);
    this.state = { hasError: false };
    this.testError = this.testError.bind(this);
  }

  testError(): void {
    return this.setState({ hasError: true });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      throw new Error('Congratulations! You have caused an error!');
    }
    return (
      <section className="result">
        <h2>Results</h2>
        <Card result={this.props.result}></Card>
        <button onClick={this.testError}>Error test</button>
      </section>
    );
  }
}
