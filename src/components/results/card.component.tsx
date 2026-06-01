import { useCallback, type JSX } from 'react';
import type { Animals } from '../search/search.interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { usePrefetchAnimalDetails } from '../../hooks/useAnimalQueries';

export function Card({
  uid,
  name,
  avian,
  earthAnimal,
  feline,
}: Animals): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSelection, isSelected } = useSelectionStore();
  const selected = isSelected(uid);
  const prefetchDetails = usePrefetchAnimalDetails();

  const handleMouseEnter = () => {
    prefetchDetails(uid);
  };

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.checkbox-wrapper')) {
        const searchParams = new URLSearchParams(location.search);
        const page = searchParams.get('page') || '1';
        navigate(`/details/${uid}?page=${page}`);
      }
    },
    [uid, location.search, navigate]
  );

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      toggleSelection({
        uid,
        name,
        avian,
        earthAnimal,
        feline,
        json: function (): unknown {
          throw new Error('Function not implemented.');
        },
        earthInsect: false,
        canine: false,
        selectedAt: undefined,
      });
    },
    [avian, earthAnimal, feline, name, toggleSelection, uid]
  );

  return (
    <ul className={`card ${selected ? 'selected' : ''}`} onClick={handleClick}>
      <li className="card-item checkbox-wrapper">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            className="card-checkbox"
          />
          <span className="checkbox-custom"></span>
        </label>
      </li>
      <li className="card-item animal-name">{name}</li>
      <li className="card-item">
        Avian: <span className="animal-properties">{avian ? 'yes' : 'no'}</span>
      </li>
      <li className="card-item">
        Earth animal:{' '}
        <span className="animal-properties">{earthAnimal ? 'yes' : 'no'}</span>
      </li>
      <li className="card-item">
        Feline:{' '}
        <span className="animal-properties">{feline ? 'yes' : 'no'}</span>
      </li>
    </ul>
  );
}
