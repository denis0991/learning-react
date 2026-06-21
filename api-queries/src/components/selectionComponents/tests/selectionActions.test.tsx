import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionActions } from '../selectionActions.component';
import * as selectionStore from '../../../stores/useSelectionStore';

vi.mock('../../../stores/useSelectionStore', () => ({
  useSelectionStore: vi.fn(),
}));

describe('SelectionActions', () => {
  const mockClearSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStore = (count: number, items: unknown[] = []) => {
    (selectionStore.useSelectionStore as unknown as Mock).mockReturnValue({
      getSelectedCount: () => count,
      getSelectedItems: () => items,
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
      mockStore(2);
      render(<SelectionActions />);

      expect(screen.getByText(/Export/)).toBeInTheDocument();
      expect(screen.getByText(/Deselect all/)).toBeInTheDocument();
    });

    it('should show correct count', () => {
      mockStore(5);
      render(<SelectionActions />);

      const countElements = screen.getAllByText(/5/);
      expect(countElements.length).toBe(2);
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

    it('should call onExport when provided and export button is clicked', () => {
      const mockOnExport = vi.fn();
      const mockItems = [
        {
          uid: '1',
          name: 'Tiger',
          selectedAt: Date.now(),
        },
      ];
      mockStore(1, mockItems);

      render(<SelectionActions onExport={mockOnExport} />);

      const exportButton = screen.getByText(/Export/);
      fireEvent.click(exportButton);

      expect(mockOnExport).toHaveBeenCalledWith(mockItems);
    });

    it('should trigger CSV download when no onExport provided', () => {
      const mockItems = [
        {
          uid: '1',
          name: 'Tiger',
          avian: false,
          earthAnimal: true,
          feline: true,
          selectedAt: Date.now(),
        },
      ];
      mockStore(1, mockItems);

      globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
      globalThis.URL.revokeObjectURL = vi.fn();

      render(<SelectionActions />);

      const exportButton = screen.getByText(/Export/);
      fireEvent.click(exportButton);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      expect(globalThis.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('CSV conversion', () => {
    it('should convert items to CSV format', () => {
      const mockItems = [
        {
          uid: '1',
          name: 'Test Animal',
          avian: true,
          earthAnimal: false,
          feline: false,
          selectedAt: new Date('2024-01-01T12:00:00'),
        },
      ];
      mockStore(1, mockItems);

      globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
      globalThis.URL.revokeObjectURL = vi.fn();

      render(<SelectionActions />);

      const exportButton = screen.getByText(/Export/);
      fireEvent.click(exportButton);

      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
      const blob = (globalThis.URL.createObjectURL as unknown as Mock).mock
        .calls[0][0];
      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });
  });
});
