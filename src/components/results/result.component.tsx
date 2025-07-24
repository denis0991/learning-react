import { useState, type JSX } from 'react';
import { Card } from './card.component';
import type { PropsType } from './result.types';

export function Result(props: PropsType): JSX.Element {
  const [hasError, setError] = useState(false);
  if (hasError) {
    throw new Error('Congratulations! You have caused an error!');
  }
  return (
    <section className="result">
      <h2>Results</h2>
      <Card result={props.result} lackOfResult={props.lackOfResult}></Card>
      <button
        onClick={() => {
          setError(true);
        }}
      >
        Error test
      </button>
    </section>
  );
}
