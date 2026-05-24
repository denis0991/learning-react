import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectionState {
  selectedItems: Set<string>;
  toggleSelection: (uid: string) => void;
  selectItem: (uid: string) => void;
  unselectItem: (uid: string) => void;
  clearSelection: () => void;
  isSelected: (uid: string) => boolean;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selectedItems: new Set<string>(),

      toggleSelection: (uid: string) => {
        const { selectedItems } = get();
        const newSelection = new Set(selectedItems);
        if (newSelection.has(uid)) {
          newSelection.delete(uid);
        } else {
          newSelection.add(uid);
        }
        set({ selectedItems: newSelection });
      },

      selectItem: (uid: string) => {
        const { selectedItems } = get();
        const newSelection = new Set(selectedItems);
        newSelection.add(uid);
        set({ selectedItems: newSelection });
      },

      unselectItem: (uid: string) => {
        const { selectedItems } = get();
        const newSelection = new Set(selectedItems);
        newSelection.delete(uid);
        set({ selectedItems: newSelection });
      },

      clearSelection: () => {
        set({ selectedItems: new Set() });
      },

      isSelected: (uid: string) => {
        return get().selectedItems.has(uid);
      },
    }),
    {
      name: 'selected-items-storage',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (value) {
            const parsed = JSON.parse(value);
            return {
              state: {
                selectedItems: new Set(parsed.state.selectedItems),
              },
            };
          }
          return null;
        },
        setItem: (name, value) => {
          const toSave = {
            state: {
              selectedItems: Array.from(value.state.selectedItems),
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
