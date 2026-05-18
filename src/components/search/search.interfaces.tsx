export interface Props {
  resetPage(): unknown;
  value: string;
  setSearchState: (animals: Animals[], totalPages?: number) => void;
  status: Status;
  setStatus: (value: Status) => void;
  setInputValue: (value: string) => void;
  setError: (value: boolean) => void;
  setSearchError: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
  errorMessage?: string;
}
export interface Page {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
}

export interface Animals {
  uid: string;
  name: string;
  earthAnimal: boolean;
  earthInsect: boolean;
  avian: boolean;
  canine: boolean;
  feline: boolean;
}

export interface ApiResponse {
  page: Page;
  sort: { clauses: string[] };
  animals: Animals[];
}

export type Status = 'default' | 'search' | 'success' | 'error' | 'missing';
