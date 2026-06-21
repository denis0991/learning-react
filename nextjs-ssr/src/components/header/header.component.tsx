import { type ReactElement } from 'react';
import './header.styles.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ThemeSwitcher } from '../themeSwitcher/themeSwitcher.component';
import { useTheme } from '../../hooks/useTheme';
import { queryClient } from '../../tanstack/queryClient';
import { animalKeys } from '../../hooks/useAnimalQueries';
import { RefreshButton } from '../common/refreshButton';

export function Header({
  onRefresh,
}: {
  onRefresh?: () => Promise<void>;
}): ReactElement {
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
          Home
        </Link>
        <Link className="nav-menu__link" href="/about">
          About
        </Link>
      </nav>
      <RefreshButton onRefresh={handleRefresh} size="small" />
      <ThemeSwitcher />
    </header>
  );
}

