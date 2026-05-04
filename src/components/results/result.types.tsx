import type { Animals } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
  searchError?: boolean;
  errorMessage?: string;
}

export interface ResultState {
  hasError: boolean;
}

export interface PropsCard {
  result: Animals[];
  lackOfResult: boolean;
  searchError?: boolean;
  errorMessage?: string;
}

export interface AnimalCardProps {
  animal: Animals;
}
