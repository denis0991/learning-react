'use client';

import { useLocale } from 'next-intl';
import { useCallback } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();

  const switchLocale = useCallback((newLocale: 'en' | 'ru') => {
    if (newLocale === locale) return;

    let path = window.location.pathname;
    const currentLocale = `/${locale}`;
    if (path.startsWith(currentLocale)) {
      path = path.replace(currentLocale, '') || '/';
    }
    
    window.location.href = `/${newLocale}${path}`;
  }, [locale]);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={() => switchLocale('en')}
        style={{ 
          fontWeight: locale === 'en' ? 'bold' : 'normal',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        🇬🇧 EN
      </button>
      <button 
        onClick={() => switchLocale('ru')}
        style={{ 
          fontWeight: locale === 'ru' ? 'bold' : 'normal',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        🇷🇺 RU
      </button>
    </div>
  );
}