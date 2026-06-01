import { type JSX, useCallback } from 'react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import './selection.css';

export function SelectionPanel(): JSX.Element | null {
  const { getSelectedItems, clearSelection, unselectItem, getSelectedCount } =
    useSelectionStore();

  const selectedCount = getSelectedCount();
  const selectedItems = getSelectedItems();

  const handleClearAll = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleRemoveItem = useCallback(
    (uid: string) => {
      unselectItem(uid);
    },
    [unselectItem]
  );

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="selection-panel">
      <div className="selection-panel-header">
        <div className="selection-info">
          <span className="selection-count">{selectedCount}</span>
          <span className="selection-text">
            {selectedCount === 1 ? 'item selected' : 'items selected'}
          </span>
        </div>
        <button
          className="clear-all-button"
          onClick={handleClearAll}
          aria-label="Deselect all items"
        >
          Deselect all
        </button>
      </div>

      <div className="selection-list">
        {selectedItems.map((item) => (
          <div key={item.uid} className="selection-item">
            <div className="selection-item-info">
              <span className="selection-item-name">{item.name}</span>
              <div className="selection-item-properties">
                {item.avian && <span className="property-badge">Avian</span>}
                {item.earthAnimal && (
                  <span className="property-badge">Earth</span>
                )}
                {item.feline && <span className="property-badge">Feline</span>}
              </div>
            </div>
            <button
              className="remove-item-button"
              onClick={() => handleRemoveItem(item.uid)}
              aria-label={`Deselect ${item.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="selection-panel-footer">
        <span className="selection-note">
          Selections persist across all pages and searches
        </span>
      </div>
    </div>
  );
}
