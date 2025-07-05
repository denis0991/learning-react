import './App.css';
import React, { type ReactNode } from 'react';
import { Header, Search, Result } from './index';
import type { AppState } from './types/app.interfaces';
import { ErrorBoundary } from './error-boundary/error-boundary';

export class App extends React.Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    let initialValue = '';
    try {
      const savedValue = localStorage.getItem('request');
      initialValue = savedValue ? JSON.parse(savedValue) : '';
    } catch (e) {
      console.error('Ошибка доступа к localStorage:', e);
    }
    this.state = {
      result: <div>Waiting for the result</div>,
      status: 'default',
      inputValue: initialValue,
    };
    this.setSearchState = this.setSearchState.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
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
          ></Search>
          <ErrorBoundary>
            <Result result={this.state.result}></Result>
          </ErrorBoundary>
        </main>
      </>
    );
  }

  setSearchState(value: React.ReactElement): void {
    this.setState({ result: value });
  }

  setStatus(status: string): void {
    this.setState({ status: status });
  }

  setInputValue(value: string): void {
    this.setState({ inputValue: value });
  }
}
