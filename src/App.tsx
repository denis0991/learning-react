import './App.css';
import React, { type ReactNode } from 'react';
import {
  Header,
  Search,
  Result,
  ErrorBoundary,
  type AppState,
  type Status,
  type Animals,
} from './index';

export class App extends React.Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    let inputValue = '';

    try {
      const savedValue = localStorage.getItem('request');
      inputValue = savedValue ? JSON.parse(savedValue) : '';
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
    this.state = {
      result: [],
      status: 'default',
      inputValue,
      lackOfResult: false,
      searchError: false,
      errorResetTrigger: 0,
      errorMessage: '',
    };
    this.setSearchState = this.setSearchState.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setError = this.setError.bind(this);
    this.setSearchError = this.setSearchError.bind(this);
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
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
            setErrorMessage={this.setErrorMessage}
            errorMessage={this.state.errorMessage}
          ></Search>
          <ErrorBoundary resetTrigger={this.state.errorResetTrigger}>
            <Result
              result={this.state.result}
              lackOfResult={this.state.lackOfResult}
              searchError={this.state.searchError}
              errorMessage={this.state.errorMessage}
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
    this.resetErrorBoundary();
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

  resetErrorBoundary(): void {
    this.setState((prev: AppState) => ({
      errorResetTrigger: prev.errorResetTrigger + 1,
    }));
  }

  setErrorMessage = (message: string): void => {
    this.setState({ errorMessage: message });
  };
}
