'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { JSX } from 'react';
import './notFound.styles.css';

export function NotFound(): JSX.Element {
  const t = useTranslations('notFound');

  return (
    <section className="not-found">
      <div className="not-found__container">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">{t('title')}</h1>
        <p className="not-found__message">
          {t('description')}
        </p>
        <Link href="/" className="not-found__button">
          {t('goHome')}
        </Link>
      </div>
    </section>
  );
}
