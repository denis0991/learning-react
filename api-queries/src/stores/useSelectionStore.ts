import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Animals } from '../components/search/search.interfaces';

interface SelectionState {
  selectedItems: Map<string, SelectedItem>;
  toggleSelection: (animal: Animals) => void;
  selectItem: (animal: Animals) => void;
  unselectItem: (uid: string) => void;
  clearSelection: () => void;
  isSelected: (uid: string) => boolean;
  getSelectedCount: () => number;
  getSelectedItems: () => SelectedItem[];
  getSelectedUids: () => string[];
}

interface SelectedItem extends Animals {
  selectedAt: number;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selectedItems: new Map<string, SelectedItem>(),

      toggleSelection: (animal: Animals) => {
        const { selectedItems } = get();
        const newSelection = new Map(selectedItems);

        if (newSelection.has(animal.uid)) {
          newSelection.delete(animal.uid);
        } else {
          newSelection.set(animal.uid, {
            ...animal,
            selectedAt: Date.now(),
          });
        }
        set({ selectedItems: newSelection });
      },

      selectItem: (animal: Animals) => {
        const { selectedItems } = get();
        const newSelection = new Map(selectedItems);
        newSelection.set(animal.uid, {
          ...animal,
          selectedAt: Date.now(),
        });
        set({ selectedItems: newSelection });
      },

      unselectItem: (uid: string) => {
        const { selectedItems } = get();
        const newSelection = new Map(selectedItems);
        newSelection.delete(uid);
        set({ selectedItems: newSelection });
      },

      clearSelection: () => {
        set({ selectedItems: new Map() });
      },

      isSelected: (uid: string) => {
        return get().selectedItems.has(uid);
      },

      getSelectedCount: () => {
        return get().selectedItems.size;
      },

      getSelectedItems: () => {
        return Array.from(get().selectedItems.values());
      },

      getSelectedUids: () => {
        return Array.from(get().selectedItems.keys());
      },
    }),
    {
      name: 'selected-items-storage',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (value) {
            const parsed = JSON.parse(value);
            const selectedItemsMap = new Map();
            if (parsed.state.selectedItems) {
              Object.entries(parsed.state.selectedItems).forEach(
                ([key, value]) => {
                  selectedItemsMap.set(key, value);
                }
              );
            }
            return {
              state: {
                selectedItems: selectedItemsMap,
              },
            };
          }
          return null;
        },
        setItem: (name, value) => {
          const selectedItemsObj: Record<string, SelectedItem> = {};
          value.state.selectedItems.forEach(
            (item: SelectedItem, key: string) => {
              selectedItemsObj[key] = item;
            }
          );

          const toSave = {
            state: {
              selectedItems: selectedItemsObj,
            },
          };
          localStorage.setItem(name, JSON.stringify(toSave));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
