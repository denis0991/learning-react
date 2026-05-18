import { type ReactElement } from 'react';
import './header.styles.css';
import { Link } from 'react-router-dom';

export function Header(): ReactElement {
  return (
    <header>
      <h1>Star Trek</h1>
      <h2>Animals</h2>
      <nav className="header__nav-menu">
        <Link className="nav-menu__link" to="/">
          Home
        </Link>
        <Link className="nav-menu__link" to="/about">
          About
        </Link>
      </nav>
    </header>
  );
}
