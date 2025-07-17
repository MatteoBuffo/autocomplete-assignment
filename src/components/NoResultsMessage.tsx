import React from "react";
import './AutoCompleteMessage.css';
import './NoResultsMessage.css';

const NoResultsMessage: React.FC = () => {
    return (
        <div
            className="autocomplete-message autocomplete-message--no-results"
            aria-live="polite"
        >
            No users found. Try refining your search.
        </div>
    )
}

export default NoResultsMessage;
