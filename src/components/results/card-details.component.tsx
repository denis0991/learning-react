import { type ReactElement } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { Animals } from '../search/search.interfaces';

type CardDetailsProps = {
  result: Animals[];
};

export function CardDetails({ result }: CardDetailsProps): ReactElement {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const animal = result.find((a) => a.uid === uid);
  if (!animal) {
    return <div className="card-details_disactive"></div>;
  }
  return (
    <div className="card-details">
      <h2 className="card-details__header">{animal.name}</h2>
      <ul className="details-list">
        <li className="details-list__item">
          Avian:{' '}
          <span className="item-span">{animal.avian ? 'yes' : 'no'}</span>
        </li>
        <li className="details-list__item">
          Earth animal:{' '}
          <span className="item-span">{animal.earthAnimal ? 'yes' : 'no'}</span>
        </li>
        <li className="details-list__item">
          Earth insect:{' '}
          <span className="item-span">{animal.earthInsect ? 'yes' : 'no'}</span>
        </li>
        <li className="details-list__item">
          Canine:{' '}
          <span className="item-span">{animal.canine ? 'yes' : 'no'}</span>
        </li>

        <li className="details-list__item">
          Feline:{' '}
          <span className="item-span">{animal.feline ? 'yes' : 'no'}</span>
        </li>
      </ul>
      <button
        onClick={() => navigate(`/search?page=${page}`)}
        className="back-button"
      >
        Close
      </button>
    </div>
  );
}
