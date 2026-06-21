import { type JSX, useCallback, useState } from 'react';
import './RefreshButton.css';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  size?: 'small' | 'medium' | 'large';
  isRefreshing?: boolean;
}

export function RefreshButton({
  onRefresh,
  size = 'medium',
  isRefreshing: externalIsRefreshing,
}: RefreshButtonProps): JSX.Element {
  const [internalIsRefreshing, setInternalIsRefreshing] = useState(false);
  const isRefreshing = externalIsRefreshing ?? internalIsRefreshing;

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    if (!externalIsRefreshing) {
      setInternalIsRefreshing(true);
    }

    try {
      await onRefresh();
    } finally {
      if (!externalIsRefreshing) {
        setInternalIsRefreshing(false);
      }
    }
  }, [onRefresh, isRefreshing, externalIsRefreshing]);

  return (
    <button
      className={`refresh-button refresh-button-${size} ${isRefreshing ? 'refreshing' : ''}`}
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh data"
      title="Refresh data"
    >
      <span className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}>⟳</span>
      {isRefreshing ? 'Refreshing...' : 'Refresh cache'}
    </button>
  );
}
