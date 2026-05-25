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
        {loading && <div className="loader"></div>}
        {item && (
          <div className="details-content">
            <h3>{item.name}</h3>
            <p className="details-property">
              <span className="property-label">Earth animal:</span>
              <span className="animal-properties">
                {formatValue(item.earthAnimal)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">Earth insect:</span>
              <span className="animal-properties">
                {formatValue(item.earthInsect)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">Avian:</span>
              <span className="animal-properties">
                {formatValue(item.avian)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">Canine:</span>
              <span className="animal-properties">
                {formatValue(item.canine)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">Feline:</span>
              <span className="animal-properties">
                {formatValue(item.feline)}
              </span>
            </p>
          </div>
        )}
        <button onClick={handleClose}>✕ Close</button>
      </div>
    </>
  );
}
