import { type JSX } from 'react';
import { useTheme } from '../../context/theme-context';
import './switcher.css';
import { getIconByTheme } from '../../utils/icons-switcher.utils';

export function ThemeSwitcher(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <button
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => theme !== 'light' && toggleTheme()}
        aria-label="Light theme"
        title="Light theme"
      >
        {getIconByTheme('light')}
      </button>
      <button
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => theme !== 'dark' && toggleTheme()}
        aria-label="Dark theme"
        title="Dark theme"
      >
        {getIconByTheme('dark')}
      </button>
    </div>
  );
}
