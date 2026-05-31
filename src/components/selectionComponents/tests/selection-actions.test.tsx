import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionActions } from '../selectionActions.component';
import { useSelectionStore } from '../../../stores/useSelectionStore';

vi.mock('../../../stores/selectionStore', () => ({
  useSelectionStore: vi.fn(),
}));

describe('SelectionActions', () => {
  const mockClearSelection = vi.fn();
  const mockGetSelectedCount = vi.fn();
  const mockGetSelectedItems = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStore = (count: number, items: unknown[] = []) => {
    const mockedUseSelectionStore = useSelectionStore as unknown as ReturnType<
      typeof vi.fn
    >;
    mockedUseSelectionStore.mockReturnValue({
      getSelectedCount: mockGetSelectedCount.mockReturnValue(count),
      getSelectedItems: mockGetSelectedItems.mockReturnValue(items),
      clearSelection: mockClearSelection,
    });
  };

  describe('rendering', () => {
    it('should not render when no items selected', () => {
      mockStore(0);
      const { container } = render(<SelectionActions />);
      expect(container.firstChild).toBeNull();
    });

    it('should render when items are selected', () => {
      mockStore(3);
      render(<SelectionActions />);

      expect(screen.getByText(/Export/)).toBeInTheDocument();
      expect(screen.getByText(/Deselect all/)).toBeInTheDocument();
      expect(screen.getAllByText(/3/).length).toBe(2);
    });

    it('should show singular text when count is 1', () => {
      mockStore(1);
      render(<SelectionActions />);

      expect(screen.getByText(/Export/)).toBeInTheDocument();
      expect(screen.getByText(/Deselect all/)).toBeInTheDocument();
      expect(screen.getAllByText(/1/).length).toBe(2);
    });
  });

  describe('interactions', () => {
    it('should call clearSelection when Deselect all button is clicked', () => {
      mockStore(2);
      render(<SelectionActions />);

      const deselectButton = screen.getByText(/Deselect all/);
      fireEvent.click(deselectButton);

      expect(mockClearSelection).toHaveBeenCalledTimes(1);
    });

    it('should trigger download when Export button is clicked', () => {
      const mockItems = [
        {
          uid: '1',
          name: 'Tiger',
          avian: false,
          earthAnimal: true,
          feline: true,
        },
        {
          uid: '2',
          name: 'Lion',
          avian: false,
          earthAnimal: true,
          feline: false,
        },
      ];
      mockStore(2, mockItems);

      globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
      globalThis.URL.revokeObjectURL = vi.fn();

      render(<SelectionActions />);

      const exportButton = screen.getByText(/Export/);
      fireEvent.click(exportButton);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
