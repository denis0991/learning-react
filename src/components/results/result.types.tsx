import type { Animals } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
  searchError: boolean;
}

export interface PropsCard {
  result: Animals[];
  lackOfResult: boolean;
}
