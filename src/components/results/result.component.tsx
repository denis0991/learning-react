import { useState, type ReactElement } from 'react';
import { Card } from './card.component';
import type { PropsType } from './result.types';

export function Result(props: PropsType): ReactElement {
  const [hasError, setError] = useState(false);
  if (hasError) {
    throw new Error('Congratulations! You have caused an error!');
  }
  return (
    <section className="result">
      <h2>Results</h2>
      {props.searchError ? (
        <p>Search error</p>
      ) : (
        <Card result={props.result} lackOfResult={props.lackOfResult} />
      )}
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
