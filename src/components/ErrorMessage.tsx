import React from "react";
import './AutoCompleteMessage.css';
import './ErrorMessage.css';

interface ErrorMessageProps {
    error: string | null;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({error, onRetry}) => {
    return (
        <div
            className="autocomplete-message autocomplete-message--error"
            role="alert"
            aria-live="polite"
        >
            {error}
            {onRetry && (
                <button
                    type="button"
                    className="retry-button"
                    onClick={onRetry}
                >
                    Retry
                </button>
            )}
        </div>
    )
}

export default ErrorMessage;
