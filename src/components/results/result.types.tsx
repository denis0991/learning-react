import type { Animals } from '../search/search.interfaces';

export interface PropsType {
  result: Animals[];
  lackOfResult: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchError?: boolean;
  errorMessage?: string;
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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
