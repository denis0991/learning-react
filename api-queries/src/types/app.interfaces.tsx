import type { Status, Animals } from '../components/search/search.interfaces';

export interface AppState {
  result: Animals[];
  status: Status;
  inputValue: string;
  lackOfResult: boolean;
  searchError: boolean;
  errorResetTrigger: number;
  errorMessage?: string;
}

export interface LayoutProps {
  result: Animals[];
  status: Status;
  lackOfResult: boolean;
  searchError: boolean;
  errorMessage: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}
