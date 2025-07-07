import type { Status, Animals } from '../components/search/search.interfaces';

export interface AppState {
  result: Animals[];
  status: Status;
  inputValue: string;
  lackOfResult: boolean;
  searchError: boolean;
}
