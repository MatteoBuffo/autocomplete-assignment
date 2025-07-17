import React from "react";
import {escapeRegExp} from "../utils/searchUtils";

interface HighlightedTextProps {
    text: string;
    highlight: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlight }) => {
    if (!highlight) return <>{text}</>;

    try {
        const escapedHighlight = escapeRegExp(highlight);
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <strong key={i}>{part}</strong>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    } catch (err) {
        console.error("Invalid RegEx in HighlightedText:", err);
        return <>{text}</>;
    }
};

export default HighlightedText;
