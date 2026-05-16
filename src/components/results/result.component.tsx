import { useState, type JSX } from 'react';
import { Cards } from './cards.component';
import type { PropsType } from './result.types';
import './result.styles.css';

export function Result(props: PropsType): JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError) {
    throw new Error('Congratulations! You have caused an error!');
  }
  return (
    <section className="result">
      <h2 className="result__title">Results</h2>
      <Cards
        result={props.result}
        lackOfResult={props.lackOfResult}
        searchError={props.searchError}
        errorMessage={props.errorMessage}
      ></Cards>
      <button
        onClick={() => {
          setHasError(true);
        }}
      >
        Error test
      </button>
    </section>
  );
}
