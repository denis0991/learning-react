import { useCallback, type JSX } from 'react';
import type { Props, Status } from './search.interfaces';
import { useTranslations } from 'next-intl';
import './index.css';

const renderSpinner = (status: Status): JSX.Element => {  
  switch (status) {
    case 'default':
      return <div className="default"></div>;
    case 'searching':
      return <div className="searching-loader"></div>;
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
};

export function Search(props: Props): JSX.Element {
  const t = useTranslations('search');
  const handleSearchClick = useCallback(() => {
    if (props.onSearch) {
      props.onSearch(props.value);
    }
  }, [props.onSearch, props.value]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearchClick();
      }
    },
    [handleSearchClick]
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setInputValue(e.target.value);
      props.resetPage();

      if (e.target.value === '') {
        props.setSearchState([], 0);
        props.setStatus('default');
      }
    },
    [
      props.setInputValue,
      props.resetPage,
      props.setSearchState,
      props.setStatus,
    ]
  );

  const handleClear = useCallback(() => {
    props.setInputValue('');
    props.setSearchState([], 0);
    props.setStatus('default');
    props.resetPage();
  }, [props]);

  return (
    <section className="search-component">
      <div className="search-input-wrapper">
        <input
          id="search-input"
          value={props.value}
          placeholder={t('placeholder')}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        {props.value && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {renderSpinner(props.status)}
      <button onClick={handleSearchClick}>{t('button')}</button>
    </section>
  );
}
