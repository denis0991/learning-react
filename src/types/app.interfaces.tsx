import type { Status } from '../components/search/search.interfaces';

export interface AppState {
  result: React.ReactElement;
  status: Status;
  inputValue: string;
}
