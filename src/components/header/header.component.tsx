import { type ReactElement } from 'react';
import './header.styles.css';
import { Link, useSearchParams } from 'react-router-dom';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher.component';
import { useTheme } from '../../context/theme-context';

export function Header(): ReactElement {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const { theme } = useTheme();

  return (
    <header className={`app-header ${theme}`}>
      <h1>Star Trek</h1>
      <h2>Animals</h2>
      <nav className="header__nav-menu">
        <Link className="nav-menu__link" to={`/?page=${page}`}>
          Home
        </Link>
        <Link className="nav-menu__link" to="/about">
          About
        </Link>
      </nav>
      <ThemeSwitcher />
    </header>
  );
}
