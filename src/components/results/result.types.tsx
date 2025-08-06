import type { Animals, Status } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
  searchError: boolean;
  searchParams: URLSearchParams;
}

export interface PropsCard {
  result: Animals[];
  lackOfResult: boolean;
  searchParams: URLSearchParams;
}

export interface ResultPageProps {
  status: Status;
  setStatus: (status: Status) => void;
  setSearchState: (animals: Animals[], total: number) => void;
  setError: (error: boolean) => void;
  setSearchError: (error: boolean) => void;
  result: Animals[];
  lackOfResult: boolean;
  searchError: boolean;
  errorResetTrigger: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchParams: URLSearchParams;
}
