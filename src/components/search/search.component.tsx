import React, { type ReactNode } from 'react';
import type { Props, ApiResponse } from './search.interfaces';

export class Search extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
    this.handleSearch = this.handleSearch.bind(this);
  }
  render(): ReactNode {
    return (
      <>
        <input
          value={this.props.value}
          placeholder="search.."
          onChange={(e) => {
            this.props.setInputValue(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            this.handleSearch();
            this.saveToLocalStorage(this.props.value, this.props.value);
          }}
        >
          Search
        </button>
        {this.props.status === 'search' ? (
          <div className="status"></div>
        ) : (
          <div className="status_success"></div>
        )}
      </>
    );
  }
  async handleSearch(): Promise<void> {
    try {
      this.props.setStatus('search');
      const response = await fetch(
        'https://stapi.co/api/v1/rest/animal/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${encodeURIComponent(this.props.value)}`,
        }
      );
      const data: ApiResponse = await response.json();
      this.props.setStatus('success');
      if (data.animals && data.animals.length > 0) {
        this.props.setSearchState(
          <div>
            {data.animals.map((elem) => (
              <div key={elem.uid}>{elem.name}</div>
            ))}
          </div>
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      this.props.setStatus('error');
    }
  }

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
