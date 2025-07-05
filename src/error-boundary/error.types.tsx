import type { ReactNode, ErrorInfo } from 'react';

export interface Props {
  children: ReactNode;
}

export interface State {
  hasError: boolean;
  errorMessage: string;
  errorInfo?: ErrorInfo | null;
}
