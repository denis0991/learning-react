import React, { type ReactNode } from 'react';
import type { Props, ApiResponse, Status } from './search.interfaces';
import './index.css';

export class Search extends React.Component<Props> {
  private lastSearchValue: string = '';

  constructor(props: Props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.renderSpinner = this.renderSpinner.bind(this);
  }

  render(): ReactNode {
    return (
      <section className="search-component">
        <div className="search-input-wrapper">
          <input
            id="search-input"
            value={this.props.value}
            placeholder="search.."
            onChange={(e) => {
              this.props.setInputValue(e.target.value);
            }}
          ></input>
          {this.props.value && (
            <button
              className="clear-button"
              onClick={() => {
                this.props.setInputValue('');
                this.saveToLocalStorage('request', '');
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {this.renderSpinner(this.props.status)}
        <button
          onClick={() => {
            this.handleSearch('search');
            this.saveToLocalStorage('request', this.props.value);
          }}
        >
          Search
        </button>
      </section>
    );
  }

  componentDidMount(): void {
    this.handleSearch('default');
  }

  async handleSearch(status: Status): Promise<void> {
    try {
      const searchValue = this.props.value.trim();

      if (searchValue === this.lastSearchValue && status === 'search') {
        return;
      }

      this.props.setStatus('search');
      this.lastSearchValue = searchValue;

      const response = await fetch(
        'https://stapi.co/api/v1/rest/animal/search?pageNumber=0&pageSize=12',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${encodeURIComponent(searchValue)}`,
        }
      );

      if (!response.ok) {
        this.props.setStatus('error');
        this.props.setSearchError(true);
        return;
      }

      const data: ApiResponse = await response.json();
      if (data.animals && data.animals.length > 0) {
        this.props.setStatus('success');
        this.props.setError(false);
        this.props.setSearchError(false);
        this.props.setSearchState(data.animals);
      } else {
        this.props.setStatus('missing');
        this.props.setError(true);
      }
    } catch (error) {
      this.props.setStatus('error');
      this.props.setSearchError(true);
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

      this.props.setErrorMessage(errorMessage);
    }
  }

  saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value.trim()));
  }

  renderSpinner(status: Status): ReactNode {
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
}
