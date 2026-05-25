import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSelectionStore } from '../selectionStore';
import type { Animals } from '../../components/search/search.interfaces';

const createTestAnimal = (uid: string, name: string): Animals => ({
  uid,
  name,
  avian: false,
  earthAnimal: true,
  feline: uid === '1',
  earthInsect: false,
  canine: false,
  selectedAt: Date.now(),
  json: function () {
    return this;
  },
});

describe('selectionStore', () => {
  beforeEach(() => {
    const { clearSelection } = useSelectionStore.getState();
    clearSelection();
  });

  describe('initial state', () => {
    it('should have empty selectedItems', () => {
      const state = useSelectionStore.getState();
      expect(state.getSelectedCount()).toBe(0);
      expect(state.getSelectedItems()).toEqual([]);
    });
  });

  describe('selectItem', () => {
    it('should add item to selection', () => {
      const { selectItem, getSelectedItems, getSelectedCount } =
        useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Tiger');
      selectItem(animal);

      expect(getSelectedCount()).toBe(1);
      expect(getSelectedItems()[0]).toMatchObject({
        uid: '1',
        name: 'Tiger',
        avian: false,
        earthAnimal: true,
        feline: true,
      });
      expect(getSelectedItems()[0]).toHaveProperty('selectedAt');
    });

    it('should not duplicate same item', () => {
      const { selectItem, getSelectedCount } = useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Tiger');
      selectItem(animal);
      selectItem(animal);

      expect(getSelectedCount()).toBe(1);
    });
  });

  describe('unselectItem', () => {
    it('should remove item from selection', () => {
      const { selectItem, unselectItem, getSelectedCount } =
        useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Tiger');
      selectItem(animal);
      expect(getSelectedCount()).toBe(1);

      unselectItem('1');
      expect(getSelectedCount()).toBe(0);
    });

    it('should do nothing if item not selected', () => {
      const { unselectItem, getSelectedCount } = useSelectionStore.getState();

      unselectItem('999');
      expect(getSelectedCount()).toBe(0);
    });
  });

  describe('toggleSelection', () => {
    it('should add item if not selected', () => {
      const { toggleSelection, isSelected, getSelectedCount } =
        useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Lion');
      toggleSelection(animal);

      expect(isSelected('1')).toBe(true);
      expect(getSelectedCount()).toBe(1);
    });

    it('should remove item if already selected', () => {
      const { toggleSelection, isSelected, getSelectedCount } =
        useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Lion');
      toggleSelection(animal);
      expect(isSelected('1')).toBe(true);
      expect(getSelectedCount()).toBe(1);

      toggleSelection(animal);
      expect(isSelected('1')).toBe(false);
      expect(getSelectedCount()).toBe(0);
    });
  });

  describe('clearSelection', () => {
    it('should remove all selected items', () => {
      const { selectItem, clearSelection, getSelectedCount } =
        useSelectionStore.getState();

      const animal1 = createTestAnimal('1', 'Tiger');
      const animal2 = createTestAnimal('2', 'Lion');

      selectItem(animal1);
      selectItem(animal2);

      expect(getSelectedCount()).toBe(2);

      clearSelection();
      expect(getSelectedCount()).toBe(0);
    });
  });

  describe('isSelected', () => {
    it('should return true for selected item', () => {
      const { selectItem, isSelected } = useSelectionStore.getState();

      const animal = createTestAnimal('1', 'Tiger');
      selectItem(animal);

      expect(isSelected('1')).toBe(true);
    });

    it('should return false for not selected item', () => {
      const { isSelected } = useSelectionStore.getState();
      expect(isSelected('999')).toBe(false);
    });
  });

  describe('getSelectedItems', () => {
    it('should return array of selected items', () => {
      const { selectItem, getSelectedItems } = useSelectionStore.getState();

      const animal1 = createTestAnimal('1', 'Tiger');
      const animal2 = createTestAnimal('2', 'Lion');

      selectItem(animal1);
      selectItem(animal2);

      const items = getSelectedItems();
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        uid: '1',
        name: 'Tiger',
      });
      expect(items[1]).toMatchObject({
        uid: '2',
        name: 'Lion',
      });
    });
  });

  describe('getSelectedCount', () => {
    it('should return correct count', () => {
      const { selectItem, getSelectedCount } = useSelectionStore.getState();

      const animal1 = createTestAnimal('1', 'Tiger');
      const animal2 = createTestAnimal('2', 'Lion');

      expect(getSelectedCount()).toBe(0);

      selectItem(animal1);
      expect(getSelectedCount()).toBe(1);

      selectItem(animal2);
      expect(getSelectedCount()).toBe(2);
    });
  });
});

describe('persistence', () => {
  it('should handle localStorage operations', () => {
    const originalGetItem = globalThis.localStorage.getItem;
    const originalSetItem = globalThis.localStorage.setItem;

    globalThis.localStorage.getItem = vi.fn().mockReturnValue(null);
    globalThis.localStorage.setItem = vi.fn();

    const { selectItem } = useSelectionStore.getState();

    const animal = createTestAnimal('1', 'Tiger');
    selectItem(animal);

    expect(globalThis.localStorage.setItem).toHaveBeenCalled();

    globalThis.localStorage.getItem = originalGetItem;
    globalThis.localStorage.setItem = originalSetItem;
  });
});

describe('persistence (localStorage)', () => {
  it('should handle localStorage getItem', () => {
    const originalGetItem = globalThis.localStorage.getItem;

    const mockGetItem = vi.fn();
    globalThis.localStorage.getItem = mockGetItem;

    const testData = {
      state: {
        selectedItems: {
          '1': { uid: '1', name: 'Tiger', selectedAt: Date.now() },
        },
      },
    };

    mockGetItem.mockReturnValue(JSON.stringify(testData));

    useSelectionStore.getState();

    globalThis.localStorage.getItem = originalGetItem;
  });

  it('should handle localStorage setItem', () => {
    const originalSetItem = globalThis.localStorage.setItem;

    const mockSetItem = vi.fn();
    globalThis.localStorage.setItem = mockSetItem;

    const { selectItem } = useSelectionStore.getState();
    const animal = createTestAnimal('1', 'Tiger');
    selectItem(animal);

    expect(mockSetItem).toHaveBeenCalled();

    globalThis.localStorage.setItem = originalSetItem;
  });
});
