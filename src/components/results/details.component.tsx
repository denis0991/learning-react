import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAnimalDetails } from '../../hooks/useAnimalQueries';

export function Details() {
  const { uid } = useParams<{ uid: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, error } = useAnimalDetails(uid);

  const handleClose = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}`);
  };

  if (!uid) return null;

  if (isLoading || isFetching) {
    return (
      <div className="details-panel">
        <div className="content-loader">
          <div className="loader"></div>
          <div className="content-loader-text">Loading animal details...</div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="details-panel">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">
            Error loading details. Please try again.
          </div>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    );

  const item = data?.animal;
  if (!item) return null;

  const formatValue = (value: boolean | undefined | null): string => {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return 'unknown';
  };

  return (
    <>
      <h2 className="details-title">Animal Details</h2>
      <div className="details-panel">
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
