import React from "react";
import HighlightedText from "./HighLightedText";
import './ResultsList.css';
import {LocalUser} from "../types/localUser";

interface ResultsListProps {
    results: LocalUser[];
    highlightedIndex: number;
    searchTerm: string;
    onSelect: (result: LocalUser) => void;
    itemRefs: React.RefObject<(HTMLLIElement | null)[]>;
    dropdownRef: React.RefObject<HTMLUListElement | null>;
}

const ResultsList: React.FC<ResultsListProps> = ({
                                                     results,
                                                     highlightedIndex,
                                                     searchTerm,
                                                     onSelect,
                                                     itemRefs,
                                                     dropdownRef
                                                 }) => {
    return (
        <ul ref={dropdownRef} className="autocomplete-dropdown" id="autocomplete-listbox" role="listbox">
            {results.map((option, index) => (
                <li
                    key={option.id}
                    id={`option-${option.id}`}
                    ref={(el) => void (itemRefs.current[index] = el)}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(option)
                    }}
                    className={`autocomplete-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                >
                    <HighlightedText text={option.name} highlight={searchTerm}/>
                </li>
            ))}
        </ul>
    );
};

export default ResultsList;
