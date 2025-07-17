import React from "react";
import './AutoCompleteMessage.css';

const LoadingMessage: React.FC = () => {
    return (
        <div
            className="autocomplete-message"
            role="status"
            aria-live="polite"
        >
            Loading...
        </div>
    )
}

export default LoadingMessage;
