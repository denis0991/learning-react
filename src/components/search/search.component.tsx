import React, { type ReactNode } from 'react';
import type { State, Props, ApiResponse } from './search.interfaces';

export class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
    this.handleSearch = this.handleSearch.bind(this);
  }
  render(): ReactNode {
    return (
      <>
        <input
          value={this.state.value}
          placeholder="search.."
          onChange={(e) => {
            this.setState({ value: e.target.value });
          }}
        ></input>
        <button onClick={this.handleSearch}>Search</button>
      </>
    );
  }
  async handleSearch(): Promise<void> {
    const response = await fetch('https://stapi.co/api/v1/rest/animal/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${encodeURIComponent(this.state.value)}`,
    });
    const data: ApiResponse = await response.json();
    console.log(data);
  }
}
