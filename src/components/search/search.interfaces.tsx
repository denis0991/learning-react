export interface State {
  value: string;
}

export interface Props {
  value: string;
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
