import { type ReactElement } from 'react';
import type { PropsCard } from './result.types';
import { renderAnimalsCards } from './render-animals-card.utils';
import './card.styles.css';

export function Card(props: PropsCard): ReactElement {
  if (!props.lackOfResult) {
    return (
      <div className="card-container">{renderAnimalsCards(props.result)}</div>
    );
  }
  return <div>Nothing found</div>;
}
