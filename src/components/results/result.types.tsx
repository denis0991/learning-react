import type { Animals } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
}

export interface ResultState {
  hasError: boolean;
}

export interface PropsCard {
  result: Animals[];
  lackOfResult: boolean;
}
