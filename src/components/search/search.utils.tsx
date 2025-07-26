import type { Status } from './search.interfaces';
import type { JSX } from 'react';

export function renderSpinner(status: Status): JSX.Element {
  switch (status) {
    case 'default':
      return <div className="default"></div>;
    case 'search':
      return <div className="loader"></div>;
    case 'success':
      return <div className="success"></div>;
    case 'error':
    case 'missing':
      return (
        <div className="missing">
          <span className="line line-1"></span>
          <span className="line line-2"></span>
        </div>
      );
    default:
      return <div className="default"></div>;
  }
}

export function saveToLocalStorage(key: string, value: string): void {
  localStorage.setItem(key, JSON.stringify(value));
}
