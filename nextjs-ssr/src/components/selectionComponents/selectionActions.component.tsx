'use client';

import { type JSX, useCallback, useState } from 'react';
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
const [isExporting, setIsExporting] = useState(false);
  const selectedCount = getSelectedCount();
  const selectedItems = getSelectedItems();


  const handleExport = useCallback(async () => {
    if (onExport) {
      onExport(selectedItems);
      return;
    }

    if (selectedItems.length === 0 || isExporting) return;
     setIsExporting(true);

     try {
      const animalIds = selectedItems.map((item) => item.uid);

      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${selectedItems.length}_items_${Date.now()}.csv`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(error instanceof Error ? error.message : 'Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [selectedItems, isExporting, onExport]);

  const handleDeselectAll = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="selection-actions">
      <button className="action-button export-button" onClick={handleExport} disabled={isExporting}>
        {isExporting ? '⏳ Exporting...' : `📋 Export (${selectedCount})`}
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
