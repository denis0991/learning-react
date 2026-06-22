'use server';

import { animalApi } from '@/services/animalApi';

export async function searchAnimals(formData: FormData) {
  const query = formData.get('query') as string || '';
  const page = parseInt(formData.get('page') as string || '1');

  try {
    const data = await animalApi.searchAnimals(query, page);
    
    return {
      success: true,
      data: {
        animals: data.animals || [],
        totalPages: data.page?.totalPages || 0,
        currentPage: page,
        query: query,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search animals',
    };
  }
}