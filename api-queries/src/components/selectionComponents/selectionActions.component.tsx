import { type JSX, useCallback } from 'react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { Animals } from '../search/search.interfaces';
import './selection.css';

interface SelectionActionsProps {
  onExport?: (selectedAnimals: Animals[]) => void;
}

export function SelectionActions({
  onExport,
}: SelectionActionsProps): JSX.Element | null {
  const { getSelectedCount, getSelectedItems, clearSelection } =
    useSelectionStore();

  const selectedCount = getSelectedCount();
  const selectedItems = getSelectedItems();

  const convertToCSV = (items: Animals[]): string => {
    const headers = [
      'Name',
      'UID',
      'Avian',
      'Earth Animal',
      'Feline',
      'Type',
      'Description',
      'Details URL',
      'Selected At',
    ];

    const rows = items.map((item) => {
      let type = 'Unknown';
      if (item.avian && item.feline) type = 'Avian Feline';
      else if (item.avian) type = 'Bird';
      else if (item.feline) type = 'Feline';
      else if (item.earthAnimal) type = 'Earth Animal';

      const characteristics = [];
      if (item.avian) characteristics.push('avian');
      if (item.earthAnimal) characteristics.push('earth animal');
      if (item.feline) characteristics.push('feline');

      const description =
        characteristics.length > 0
          ? `${item.name} is ${characteristics.join(', ')}.`
          : `${item.name} has no special characteristics.`;

      const detailsUrl = `${window.location.origin}/details/${item.uid}`;

      const selectedAt = (() => {
        const value = item.selectedAt;

        if (value instanceof Date) {
          return value.toLocaleString();
        }

        if (typeof value === 'string' || typeof value === 'number') {
          return new Date(value).toLocaleString();
        }

        return 'N/A';
      })();

      return [
        `"${item.name.replace(/"/g, '""')}"`,
        item.uid,
        item.avian ? 'Yes' : 'No',
        item.earthAnimal ? 'Yes' : 'No',
        item.feline ? 'Yes' : 'No',
        type,
        `"${description.replace(/"/g, '""')}"`,
        detailsUrl,
        selectedAt,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return '\uFEFF' + csvContent;
  };

  const downloadCSV = useCallback((items: Animals[]) => {
    if (items.length === 0) return;

    const csv = convertToCSV(items);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fileName = `${items.length}_items_${date}.csv`;

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, []);

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(selectedItems);
    } else {
      downloadCSV(selectedItems);
    }
  }, [onExport, selectedItems, downloadCSV]);

  const handleDeselectAll = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="selection-actions">
      <button className="action-button export-button" onClick={handleExport}>
        📋 Export ({selectedCount})
      </button>
      <button
        className="action-button deselect-button"
        onClick={handleDeselectAll}
      >
        ✕ Deselect all ({selectedCount})
      </button>
    </div>
  );
}
