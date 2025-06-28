import React, { type ReactNode } from 'react';

export interface ResultType {
  result: React.ReactElement;
}

interface PropsType {
  result: React.ReactElement;
}

export class Result extends React.Component<PropsType> {
  render(): ReactNode {
    return (
      <section className="result">
        <h2>Results</h2>
        <div>{this.props.result}</div>
      </section>
    );
  }
}
