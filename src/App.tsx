import './App.css';
import React, { type ReactNode } from 'react';
import { Header, Search, Result } from './index';
import type { AppState } from './types/app.interfaces';
import { ErrorBoundary } from './error-boundary/error-boundary';
import type { Status, Animals } from './components/search/search.interfaces';

export class App extends React.Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    let initialValue = '';
    try {
      const savedValue = localStorage.getItem('request');
      initialValue = savedValue ? JSON.parse(savedValue) : '';
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    this.state = {
      result: [],
      status: 'default',
      inputValue: initialValue,
      lackOfResult: false,
      searchError: false,
    };
    this.setSearchState = this.setSearchState.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setError = this.setError.bind(this);
    this.setSearchError = this.setSearchError.bind(this);
  }
  render(): ReactNode {
    return (
      <>
        <Header></Header>
        <main>
          <Search
            setSearchState={this.setSearchState}
            setStatus={this.setStatus}
            setInputValue={this.setInputValue}
            status={this.state.status}
            value={this.state.inputValue}
            setError={this.setError}
            setSearchError={this.setSearchError}
          ></Search>
          <ErrorBoundary>
            <Result
              result={this.state.result}
              lackOfResult={this.state.lackOfResult}
            ></Result>
          </ErrorBoundary>
        </main>
      </>
    );
  }

  setSearchState(result: Animals[]): void {
    this.setState({ result: result });
  }

  setStatus(status: Status): void {
    this.setState({ status: status });
  }

  setInputValue(value: string): void {
    this.setState({ inputValue: value });
  }

  setError(status: boolean): void {
    this.setState({ lackOfResult: status });
  }

  setSearchError(status: boolean): void {
    this.setState({ searchError: status });
  }
}
