import { type ReactElement } from 'react';
import './header.styles.css';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeSwitcher } from '../themeSwitcher/themeSwitcher.component';
import { useTheme } from '@/context/theme-context';
import { queryClient } from '../../tanstack/queryClient';
import { animalKeys } from '../../hooks/useAnimalQueries';
import { RefreshButton } from '../common/refreshButton';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';

export function Header({
  onRefresh,
}: {
  onRefresh?: () => Promise<void>;
}): ReactElement {
  const t = useTranslations('navigation');
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') || '1';
  const { theme } = useTheme();

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      queryClient.invalidateQueries({ queryKey: animalKeys.all });
    }
  };

  return (
    <header className={`app-header ${theme}`}>
      <h1>Star Trek</h1>
      <h2>Animals</h2>
      <nav className="header__nav-menu">
         <Link className="nav-menu__link" href={`/?page=${page}`}>
           {t('home')}
         </Link>
         <Link className="nav-menu__link" href="/about">
           {t('about')}
         </Link>
      </nav>
      <RefreshButton onRefresh={handleRefresh} size="small" />
      <LocaleSwitcher />
      <ThemeSwitcher />
    </header>
  );
}

