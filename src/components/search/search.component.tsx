import React, { type ReactNode } from 'react';
import type { Props, ApiResponse } from './search.interfaces';
import './index.css';

export class Search extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
    this.handleSearch = this.handleSearch.bind(this);
  }
  render(): ReactNode {
    return (
      <section className="search-component">
        <input
          id="search-input"
          value={this.props.value}
          placeholder="search.."
          onChange={(e) => {
            this.props.setInputValue(e.target.value);
          }}
        ></input>
        {(() => {
          switch (this.props.status) {
            case 'default':
              return <div className="default"></div>;
            case 'search':
              return <div className="loader"></div>;
            case 'success':
              return <div className="success"></div>;
            case 'missing':
              return (
                <div className="missing">
                  <span className="line line-1"></span>
                  <span className="line line-2"></span>
                </div>
              );
          }
        })()}
        <button
          onClick={() => {
            this.handleSearch();
            this.saveToLocalStorage('request', this.props.value);
          }}
        >
          Search
        </button>
      </section>
    );
  }
  componentDidMount(): void {
    this.handleSearch();
  }
  async handleSearch(): Promise<void> {
    try {
      this.props.setStatus('search');
      const response = await fetch(
        'https://stapi.co/api/v1/rest/animal/search?pageNumber=0&pageSize=10',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${encodeURIComponent(this.props.value)}`,
        }
      );
      const data: ApiResponse = await response.json();
      if (data.animals && data.animals.length > 0) {
        this.props.setStatus('success');
        this.props.setSearchState(
          <>
            {data.animals.map((elem) => (
              <ul key={elem.uid} className="card">
                <li className="card-item">{elem.name}</li>
                <li className="card-item">{elem.uid}</li>
                <li className="card-item">
                  Avian: {elem.avian ? 'yes' : 'no'}
                </li>
                <li className="card-item">
                  Earth animal: {elem.earthAnimal ? 'yes' : 'no'}
                </li>
                <li className="card-item">
                  Feline: {elem.feline ? 'yes' : 'no'}
                </li>
              </ul>
            ))}
          </>
        );
      } else {
        this.props.setStatus('missing');
        this.props.setSearchState(<div>Nothing found</div>);
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
