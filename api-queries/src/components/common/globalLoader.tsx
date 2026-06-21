import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import './globalLoader.css';

export function GlobalLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching + isMutating > 0;

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-spinner"></div>
    </div>
  );
}
