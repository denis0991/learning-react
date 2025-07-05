import React, { type ErrorInfo, type ReactNode } from 'react';
import type { Props, State } from './error.types';

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorInfo: null };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorMessage: error.message,
      errorInfo,
    });
    this.logErrorToServices(error.toString(), errorInfo.componentStack);
  }

  logErrorToServices = console.log;

  resetError(): void {
    this.setState({ hasError: false, errorMessage: '' });
  }

  render(): ReactNode {
    if (this.state.errorMessage) {
      return (
        <>
          <p>{this.state.errorMessage}</p>
          <button onClick={this.resetError}>Reset error</button>
        </>
      );
    }
    return this.props.children;
  }
}
