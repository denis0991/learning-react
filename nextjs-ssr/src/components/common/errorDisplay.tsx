import { type JSX } from 'react';
import './errorDisplay.css';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message,
  onRetry,
}: ErrorDisplayProps): JSX.Element {
  return (
    <div className="error-container-full">
      <div className="error-title">Something went wrong</div>
      <div className="error-message-full">{message}</div>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
