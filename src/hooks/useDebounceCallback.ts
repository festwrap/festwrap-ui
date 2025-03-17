import { useCallback, useRef } from 'react';

/**
 * Hook to debounce a callback function
 * @param callback - Function to execute after the debounce
 * @param delay - Delay in milliseconds
 */
export function useDebouncedCallback<T extends (..._args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
