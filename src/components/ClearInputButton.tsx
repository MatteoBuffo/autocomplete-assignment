import React from "react";
import './ClearInputButton.css';

interface ClearInputButtonProps {
    handleOnClick: () => void;
}

const ClearInputButton: React.FC<ClearInputButtonProps> = ({handleOnClick}) => {
    return (
        <button
            className="autocomplete-clear-btn"
            onClick={handleOnClick}
            aria-label="Clear input"
            type="button"
        >
            ×
        </button>
    )
}

export default ClearInputButton;
