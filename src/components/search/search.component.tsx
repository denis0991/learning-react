import { useCallback, useEffect, useState, type JSX } from 'react';
import type { Props, ApiResponse, Status } from './search.interfaces';
import './index.css';

const renderSpinner = (status: Status): JSX.Element => {
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
};

export function Search(props: Props): JSX.Element {
  const [lastSearchValue, setLastSearchValue] = useState<string>('');

  const saveToLocalStorage = useCallback((key: string, value: string): void => {
    localStorage.setItem(key, JSON.stringify(value.trim()));
  }, []);

  const handleSearch = useCallback(
    async (status: Status, page: number = 0): Promise<void> => {
      try {
        const searchValue = props.value.trim();

        if (searchValue === lastSearchValue && status === 'search') {
          return;
        }

        props.setStatus('search');
        setLastSearchValue(searchValue);

        const response = await fetch(
          `https://stapi.co/api/v1/rest/animal/search?pageNumber=${page}&pageSize=12`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(searchValue)}`,
          }
        );

        if (!response.ok) {
          props.setStatus('error');
          props.setSearchError(true);
          return;
        }

        const data: ApiResponse = await response.json();

        if (data.animals && data.animals.length > 0) {
          props.setStatus('success');
          props.setError(false);
          props.setSearchError(false);
          const totalPages = data.page?.totalPages || 0;
          props.setSearchState(data.animals, totalPages);
        } else {
          props.setStatus('missing');
          props.setError(true);
          props.setSearchState([], 0);
        }
      } catch (error) {
        props.setStatus('error');
        props.setSearchError(true);

        let errorMessage = 'Something went wrong. Please try again later.';

        if (error instanceof Error) {
          if (
            error.message.includes('Failed to fetch') ||
            error.message.includes('CORS')
          ) {
            errorMessage =
              'Unable to connect to search service. Please check your network connection.';
          } else if (error.message.includes('404')) {
            errorMessage = 'Search service not found. Please try again later.';
          }
        }

        props.setErrorMessage(errorMessage);
      }
    },
    [
      props.value,
      props.setStatus,
      props.setSearchError,
      props.setError,
      props.setSearchState,
      props.setErrorMessage,
      lastSearchValue,
    ]
  );

  useEffect(() => {
    handleSearch('default', 0);
  }, []);

  return (
    <section className="search-component">
      <div className="search-input-wrapper">
        <input
          id="search-input"
          value={props.value}
          placeholder="search.."
          onChange={(e) => {
            props.setInputValue(e.target.value);
          }}
        />
        {props.value && (
          <button
            className="clear-button"
            onClick={() => {
              props.setInputValue('');
              saveToLocalStorage('request', '');
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {renderSpinner(props.status)}
      <button
        onClick={() => {
          handleSearch('search', 0);
          saveToLocalStorage('request', props.value);
        }}
      >
        Search
      </button>
    </section>
  );
}
