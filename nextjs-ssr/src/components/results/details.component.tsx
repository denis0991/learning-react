'use client'

import { useParams } from "next/navigation";
import { useAnimalDetails } from "../../hooks/useAnimalQueries";
import { ErrorDisplay } from "../common/errorDisplay";
import { useTranslations } from 'next-intl';
import { useSearchParams } from "next/navigation";
import { useRouter } from '../../../i18n/navigation';

export function Details() {
  const { uid } = useParams<{ uid: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('details');

  const { data, isLoading, isFetching, error, refetch } = useAnimalDetails(uid);

  const handleClose = () => {
    const page = searchParams.get("page") || "1";
    router.push(`/?page=${page}`);
  };

  if (!uid) return null;

  if (isLoading || isFetching) {
    return (
      <div className="details-panel">
        <div className="content-loader">
          <div className="loader"></div>
          <div className="content-loader-text">{t('loading')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = t('error');
    if (
      error.message?.includes("Network error") ||
      error.message?.includes("Failed to fetch")
    ) {
      errorMessage =
        t('error');
    } else if (error.message?.includes("404")) {
      errorMessage = "Animal not found.";
    }
    return (
      <div className="details-panel">
        <ErrorDisplay message={errorMessage} onRetry={refetch} />
        <button onClick={handleClose} className="close-btn">
          ✕ {t('close')}
        </button>
      </div>
    );
  }
  const item = data?.animal;
  if (!item) return null;

  const formatValue = (value: boolean | undefined | null): string => {
    if (value === true) return "yes";
    if (value === false) return "no";
    return "unknown";
  };

  return (
    <>
      <h2 className="details-title">{t('title')}</h2>
      <div className="details-panel">
        {item && (
          <div className="details-content">
            <h3>{item.name}</h3>
            <p className="details-property">
              <span className="property-label">{t('properties.earthAnimal')}:</span>
              <span className="animal-properties">
                {formatValue(item.earthAnimal)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">{t('properties.earthInsect')}:</span>
              <span className="animal-properties">
                {formatValue(item.earthInsect)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">{t('properties.avian')}:</span>
              <span className="animal-properties">
                {formatValue(item.avian)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">{t('properties.canine')}:</span>
              <span className="animal-properties">
                {formatValue(item.canine)}
              </span>
            </p>
            <p className="details-property">
              <span className="property-label">{t('properties.feline')}:</span>
              <span className="animal-properties">
                {formatValue(item.feline)}
              </span>
            </p>
          </div>
        )}
        <button onClick={handleClose}>✕ {t('close')}</button>
      </div>
    </>
  );
}
