import React, { type ReactNode } from 'react';
import { Cards } from './cards.component';
import type { PropsType, ResultState } from './result.types';
import './result.styles.css';

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
        <h2 className="result__title">Results</h2>
        <Cards
          result={this.props.result}
          lackOfResult={this.props.lackOfResult}
          searchError={this.props.searchError}
          errorMessage={this.props.errorMessage}
        ></Cards>
        <button onClick={this.testError}>Error test</button>
      </section>
    );
  }
}
