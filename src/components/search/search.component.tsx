import { useState, useEffect, useCallback } from 'react';
import type { ReactElement } from 'react';
import { renderSpinner, saveToLocalStorage } from './search.utils';
import type { Props, ApiResponse } from './search.interfaces';
import './index.css';

export function Search(props: Props): ReactElement {
  const [value, setValue] = useState<string>('');

  const handleSearch = useCallback(
    async (query?: string, page: number = 1) => {
      const searchValue: string = query ?? value;
      try {
        props.setStatus('search');
        const response = await fetch(
          `https://stapi.co/api/v1/rest/animal/search?pageNumber=${page - 1}&pageSize=10`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(searchValue)}`,
          }
        );
        const data: ApiResponse = await response.json();
        if (data.animals && data.animals.length > 0) {
          props.setStatus('success');
          props.setError(false);
          props.setSearchError(false);
          props.setSearchState(
            data.animals,
            Math.ceil(data.page.totalPages / 10)
          );
        } else {
          props.setStatus('missing');
          props.setError(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        props.setStatus('error');
        props.setSearchError(true);
      }
    },
    [
      props.setStatus,
      props.setError,
      props.setSearchError,
      props.setSearchState,
    ]
  );

  useEffect(() => {
    const saved: string | null = localStorage.getItem('request');
    if (saved) {
      const parsed: string = JSON.parse(saved);
      setValue(parsed);
      handleSearch(parsed, props.currentPage);
    }
  }, [props.currentPage]);

  return (
    <section className="search-component">
      <input
        id="search-input"
        value={value}
        placeholder="search.."
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></input>
      {renderSpinner(props.status)}
      <button
        onClick={() => {
          saveToLocalStorage('request', value);
          handleSearch(value, 1);
        }}
      >
        Search
      </button>
    </section>
  );
}
