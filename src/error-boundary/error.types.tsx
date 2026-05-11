import type { ReactNode, ErrorInfo } from 'react';

export interface Props {
  children: ReactNode;
  resetTrigger: number;
}

export interface State {
  hasError: boolean;
  errorMessage: string;
  errorInfo?: ErrorInfo | null;
}
