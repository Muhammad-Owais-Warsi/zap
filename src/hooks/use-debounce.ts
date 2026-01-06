import { useEffect, useRef, useCallback } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 500,
): T {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const callbackRef = useRef(callback);

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay],
    ) as T;

    return debouncedCallback;
}
