import type { Animals, Status } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
  searchError: boolean;
}

export interface PropsCard {
  result: Animals[];
  lackOfResult: boolean;
}

export interface ResultPageProps {
  status: Status;
  setStatus: (status: Status) => void;
  setSearchState: (animals: Animals[]) => void;
  setError: (error: boolean) => void;
  setSearchError: (error: boolean) => void;
  result: Animals[];
  lackOfResult: boolean;
  searchError: boolean;
  errorResetTrigger: number;
}
