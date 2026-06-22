'use server';

import { animalApi } from '@/services/animalApi';

export async function generateCSV(animalIds: string[]) {
  try {
    if (!animalIds || animalIds.length === 0) {
      return {
        success: false,
        error: 'No animals selected',
      };
    }

    const animals = await Promise.all(
      animalIds.map(async (id) => {
        const response = await animalApi.getAnimalDetails(id);
        return response.animal;
      })
    );

    const headers = [
      'Name',
      'UID',
      'Avian',
      'Earth Animal',
      'Earth Insect',
      'Canine',
      'Feline',
    ];

    const rows = animals.map((animal) => [
      `"${animal.name.replace(/"/g, '""')}"`,
      animal.uid,
      animal.avian ? 'Yes' : 'No',
      animal.earthAnimal ? 'Yes' : 'No',
      animal.earthInsect ? 'Yes' : 'No',
      animal.canine ? 'Yes' : 'No',
      animal.feline ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const csvWithBOM = '\uFEFF' + csvContent;

    return {
      success: true,
      data: csvWithBOM,
      filename: `animals_${Date.now()}.csv`,
    };
  } catch (error) {
    console.error('CSV generation error:', error);
    return {
      success: false,
      error: 'Failed to generate CSV',
    };
  }
}