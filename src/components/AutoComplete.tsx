import React, {
    ChangeEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import './AutoComplete.css';
import SearchIcon from './SearchIcon';
import ClearInputButton from './ClearInputButton';
import LoadingMessage from './LoadingMessage';
import NoResultsMessage from './NoResultsMessage';
import ErrorMessage from './ErrorMessage';
import ResultsList from './ResultsList';
import {LocalUser} from '../types/localUser';
import useIsMobile from "../hooks/useIsMobile";

interface AutoCompleteProps {
    fetchData: (searchTerm: string) => Promise<LocalUser[]>;
    placeholder?: string;
    debounceDelay?: number;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
                                                       fetchData,
                                                       placeholder = "Search...",
                                                       debounceDelay = 500,
                                                   }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<LocalUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showResultsDropdown, setShowResultsDropdown] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [searchRequestToken, setSearchRequestToken] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsDropdownRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const currentRequestId = useRef<number>(0);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const blurCausedByEnter = useRef(false);

    const isMobile = useIsMobile();

    // Handles debounced search requests to reduce API calls while typing
    useEffect(() => {
        const trimmed = searchTerm.trim();

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (trimmed === '') {
            currentRequestId.current++;
            setResults([]);
            setShowResultsDropdown(false);
            setLoading(false);
            setError(null);
            return;
        }

        debounceTimeout.current = setTimeout(() => {
            const requestId = ++currentRequestId.current;

            setLoading(true);
            setError(null);

            fetchData(trimmed)
                .then(results => {
                    // Ignores results from outdated requests (race condition prevention)
                    if (requestId !== currentRequestId.current) return;

                    // Ignores results if the input value has changed since the request was sent
                    if (trimmed !== inputRef.current?.value.trim()) return;

                    setResults(results);
                    setShowResultsDropdown(true);
                    setHighlightedIndex(-1);
                    setLoading(false);
                })
                .catch((e) => {
                    if (requestId === currentRequestId.current) {
                        setResults([]);
                        setLoading(false);
                        setError(e.message);
                    }
                });
        }, debounceDelay);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [searchTerm, fetchData, debounceDelay, searchRequestToken]);

    // Listens to global clicks to detect those outside the input and the results dropdown. Helps properly close the dropdown on outside clicks on mobile devices
    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            const clickedOnInput = inputRef.current?.contains(e.target as Node);
            const clickedOnDropdown = resultsDropdownRef.current?.contains(e.target as Node);

            if (!clickedOnInput && !clickedOnDropdown) {
                setTimeout(() => {
                    if (!inputRef.current || document.activeElement !== inputRef.current) {
                        setIsInputFocused(false);
                        setShowResultsDropdown(false);
                    }
                }, 50); // Waits for blur to finalize
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    // Scrolls the page if the target results dropdown entry is not visible
    useEffect(() => {
        if (
            highlightedIndex >= 0 &&
            itemRefs.current[highlightedIndex]
        ) {
            itemRefs.current[highlightedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [highlightedIndex]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleFocus = () => {
        setIsInputFocused(true);
        if (searchTerm) {
            setShowResultsDropdown(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            // If blur was triggered by pressing Enter, ignores to keep the results dropdown open
            if (blurCausedByEnter.current) {
                blurCausedByEnter.current = false;
                return;
            }

            // Defers closing; the global click listener will decide if the results dropdown should close
            setIsInputFocused(false);
        }, 0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                // Focuses the next result (or the first if the bottom is reached)
                setHighlightedIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                // Focuses the previous result (or the last if the top is reached)
                setHighlightedIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                if (highlightedIndex >= 0) {
                    selectResult(results[highlightedIndex]);
                }
                // For mobile browsers, closes the virtual keyboard by blurring the input, but keeps the results dropdown visible
                if (isMobile && inputRef.current) {
                    blurCausedByEnter.current = true;
                    inputRef.current.blur();
                }
                break;
            case 'Escape':
                setShowResultsDropdown(false);
                break;
        }
    };

    const selectResult = (result: LocalUser) => {
        // Ignores if the search term matches the selected result
        if (result.name === searchTerm) return;

        // Focuses the auto-complete input for user convenience (the input might get unfocused after tapping outside or pressing Enter)
        // Improves mobile UX
        if (inputRef.current)
            inputRef.current.focus();

        setSearchTerm(result.name);
        setSearchRequestToken(prev => prev + 1);
        setShowResultsDropdown(false);
    };

    const handleRetry = () => {
        setError(null);
        setSearchRequestToken(prev => prev + 1);
    }


    return (
        <div
            className="autocomplete"
            role="combobox"
            aria-haspopup="listbox"
            aria-owns="autocomplete-listbox"
            aria-expanded={showResultsDropdown}
            aria-controls="autocomplete-listbox"
        >
            <SearchIcon/>
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="autocomplete-input"
                inputMode="search"
                enterKeyHint="search"
                role="searchbox"
                aria-label={placeholder}
                aria-autocomplete="list"
                aria-activedescendant={
                    highlightedIndex >= 0 ? `option-${results[highlightedIndex]?.id}` : undefined
                }
            />
            {
                searchTerm &&
                <ClearInputButton
                    handleOnClick={() => {
                        setSearchTerm('');
                    }}
                />
            }
            {
                isInputFocused &&
                showResultsDropdown &&
                results.length > 0 &&
                <ResultsList
                    results={results}
                    searchTerm={searchTerm}
                    highlightedIndex={highlightedIndex}
                    itemRefs={itemRefs}
                    onSelect={selectResult}
                    dropdownRef={resultsDropdownRef}
                />
            }
            {
                loading &&
                <LoadingMessage/>
            }
            {
                isInputFocused &&
                showResultsDropdown &&
                results.length === 0 &&
                searchTerm.trim() !== '' &&
                !loading &&
                !error &&
                <NoResultsMessage/>
            }
            {
                !loading &&
                error &&
                <ErrorMessage
                    error={error}
                    onRetry={handleRetry}
                />
            }
        </div>
    );
};

export default AutoComplete;
