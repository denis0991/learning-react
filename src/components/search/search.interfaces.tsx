export interface Props {
  value: string;
  setSearchState: (result: React.ReactElement) => void;
  status: string;
  setStatus: (value: string) => void;
  setInputValue: (value: string) => void;
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
