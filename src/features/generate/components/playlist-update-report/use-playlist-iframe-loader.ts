import { useState, useCallback, useEffect } from 'react';

interface UsePlaylistIframeLoaderProps {
  playlistId: string;
  autoRetryDelayMs?: number;
  maxRetries?: number;
}

interface UsePlaylistIframeLoaderReturn {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
  key: number;
  embedUrl: string;
  directUrl: string;
  handleIframeLoad: () => void;
  handleIframeError: () => void;
  handleRetry: () => void;
  shouldShowFallback: boolean;
  shouldShowRetryInfo: boolean;
  shouldShowSuccessButton: boolean;
}

export const usePlaylistIframeLoader = ({
  playlistId,
  autoRetryDelayMs = 3000,
  maxRetries = 2,
}: UsePlaylistIframeLoaderProps): UsePlaylistIframeLoaderReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [key, setKey] = useState(0);

  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
  const directUrl = `https://open.spotify.com/playlist/${playlistId}`;

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount((prev) => prev + 1);
    setKey((prev) => prev + 1);
  }, []);

  // Auto-retry after initial load with a delay to allow Spotify to process the playlist
  useEffect(() => {
    if (retryCount === 0) {
      const timer = setTimeout(() => {
        if (isLoading) {
          handleRetry();
        }
      }, autoRetryDelayMs);

      return () => clearTimeout(timer);
    }
  }, [retryCount, isLoading, handleRetry, autoRetryDelayMs]);

  const shouldShowFallback = hasError && retryCount > maxRetries;
  const shouldShowRetryInfo = hasError && retryCount <= maxRetries;
  const shouldShowSuccessButton = !hasError && !isLoading;

  return {
    isLoading,
    hasError,
    retryCount,
    key,
    embedUrl,
    directUrl,
    handleIframeLoad,
    handleIframeError,
    handleRetry,
    shouldShowFallback,
    shouldShowRetryInfo,
    shouldShowSuccessButton,
  };
};
