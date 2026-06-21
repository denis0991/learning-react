import type { Animals } from '../components/search/search.interfaces';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://stapi.co/api/v1/rest';

export interface SearchResponse {
  animals: Animals[];
  page: {
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface AnimalDetailsResponse {
  animal: Animals;
}

export const animalApi = {
  searchAnimals: async (
    name: string,
    page: number = 1
  ): Promise<SearchResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/animal/search?pageNumber=${page - 1}&pageSize=12`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${encodeURIComponent(name.trim())}`,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getAnimalDetails: async (uid: string): Promise<AnimalDetailsResponse> => {
    const response = await fetch(`${API_BASE_URL}/animal?uid=${uid}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
