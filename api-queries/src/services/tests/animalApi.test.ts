import { describe, it, expect, vi } from 'vitest';
import { animalApi } from '../animalApi';

describe('animalApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchAnimals', () => {
    it('should search animals successfully', async () => {
      const mockResponse = { animals: [], page: { totalPages: 0 } };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await animalApi.searchAnimals('test', 1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(animalApi.searchAnimals('test', 1)).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });
  });

  describe('getAnimalDetails', () => {
    it('should get animal details successfully', async () => {
      const mockResponse = { animal: { uid: '1', name: 'Tiger' } };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await animalApi.getAnimalDetails('1');
      expect(result).toEqual(mockResponse);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://stapi.co/api/v1/rest/animal?uid=1'
      );
    });

    it('should throw error when response is not ok', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(animalApi.getAnimalDetails('999')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('should throw error on network failure', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(animalApi.getAnimalDetails('1')).rejects.toThrow(
        'Network error'
      );
    });
  });
});
