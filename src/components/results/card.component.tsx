import { type ReactElement } from 'react';
import type { PropsCard } from './result.types';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import './card.styles.css';

export function Card(props: PropsCard): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { uid: selectedUid } = useParams();

  const handleCardClick = (uid: string) => {
    if (uid === selectedUid) {
      navigate(`/search?${searchParams}`);
    } else {
      navigate(`${uid}?${searchParams}`);
    }
  };

  if (!props.lackOfResult) {
    return (
      <div className="card-container">
        {props.result.map((animal) => (
          <ul
            key={animal.uid}
            className="card"
            onClick={() => handleCardClick(animal.uid)}
          >
            <li className="card-item animal-name">{animal.name}</li>
            <li className="card-item">
              Avian:{' '}
              <span className="animal-propertyes">
                {animal.avian ? 'yes' : 'no'}
              </span>
            </li>
            <li className="card-item">
              Earth animal:{' '}
              <span className="animal-propertyes">
                {animal.earthAnimal ? 'yes' : 'no'}
              </span>
            </li>
            <li className="card-item">
              Feline:{' '}
              <span className="animal-propertyes">
                {animal.feline ? 'yes' : 'no'}
              </span>
            </li>
          </ul>
        ))}
      </div>
    );
  }
  return <div>Nothing found</div>;
}
