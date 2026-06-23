import { type JSX } from 'react';
import type { PropsCard } from './result.types';
import type { Animals } from '../search/search.interfaces';
import { ErrorDisplay } from '../common/errorDisplay';
import { useTranslations } from 'next-intl';

import { Card } from './card.component';

export function Cards({
  result,
  lackOfResult,
  searchError,
  errorMessage,
  onRetry,
}: PropsCard): JSX.Element {
  const t = useTranslations('search');

  if (searchError) {
    return (
      <ErrorDisplay
        message={
          errorMessage || 'Something went wrong. Please try again later.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (!lackOfResult) {
    return (
      <div className="card-container">
        {result.map((animal: Animals) => (
          <Card key={animal.uid} {...animal} />
        ))}
      </div>
    );
  }

  return (
    <div className="empty-message-container">
      <div className="empty-icon">🔍</div>
      <div className="empty-text">{t('noResults')}</div>
    </div>
  );
}
