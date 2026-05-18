import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import type { Animals } from '../search/search.interfaces';

export function Details() {
  const { uid } = useParams<{ uid: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Animals | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    fetch(`https://stapi.co/api/v1/rest/animal?uid=${uid}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.animal);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [uid]);

  const handleClose = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}`);
  };

  if (!uid) return null;

  const formatValue = (value: boolean | undefined | null): string => {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return 'unknown';
  };

  return (
    <>
      <h2 className="details-title">Animal Details</h2>
      <div className="details-panel">
        <button onClick={handleClose}>✕ Close</button>
        {loading && <div className="loader"></div>}
        {item && (
          <div>
            <h3>{item.name}</h3>
            <p>
              Earth animal:{' '}
              <span className="animal-properties">
                {formatValue(item.earthAnimal)}
              </span>
            </p>
            <p>
              Earth insect:{' '}
              <span className="animal-properties">
                {formatValue(item.earthInsect)}
              </span>
            </p>
            <p>
              Avian:{' '}
              <span className="animal-properties">
                {formatValue(item.avian)}
              </span>
            </p>
            <p>
              Canine:{' '}
              <span className="animal-properties">
                {formatValue(item.canine)}
              </span>
            </p>
            <p>
              Feline:{' '}
              <span className="animal-properties">
                {formatValue(item.feline)}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
