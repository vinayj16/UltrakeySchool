import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullPage = false,
}) => {
  const sizeClass = `spinner-${size}`;
  
  const spinner = (
    <div className="loading-container">
      <div className={`spinner-border ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="loading-full-page">{spinner}</div>;
  }

  return spinner;
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h5>Error</h5>
        <p>{message}</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data',
  message = 'There is no data to display',
  icon,
  action,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        {icon && <div className="empty-state-icon">{icon}</div>}
        <h5>{title}</h5>
        <p>{message}</p>
        {action && (
          <button className="btn btn-primary" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
