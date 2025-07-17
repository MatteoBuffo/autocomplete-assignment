import { useState, useEffect } from 'react';

// Returns whether the device is mobile or not based on the user agent
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            if (typeof navigator === 'undefined') {
                // Server side or no navigator
                return false;
            }
            return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        };

        setIsMobile(checkMobile());
    }, []);

    return isMobile;
}

export default useIsMobile;
