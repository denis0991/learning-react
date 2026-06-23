'use client';

import { type JSX } from 'react';
import { Cards } from './cards.component';
import type { PropsType } from './result.types';
import { Pagination } from './pagination.component';
import { useTranslations } from 'next-intl';
import './result.styles.css';

export function Result(props: PropsType): JSX.Element {
  const t = useTranslations('search');
  return (
    <section className="result">
      <h2 className="result__title">{t('results')}</h2>
      <Cards
        result={props.result}
        lackOfResult={props.lackOfResult}
        searchError={props.searchError}
        errorMessage={props.errorMessage}
        onRetry={props.onRetry}
      ></Cards>
      {props.status !== 'search' && props.result.length > 0 && (
        <Pagination
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          onPageChange={props.onPageChange}
        />
      )}
    </section>
  );
}
