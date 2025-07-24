import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import PlaylistOverviewFallback from './playlist-overview-fallback';
import PlaylistOverviewLoading from './playlist-overview-loading';
import PlaylistOverviewRetryInfo from './playlist-overview-retry-info';
import { usePlaylistIframeLoader } from './use-playlist-iframe-loader';

const DEFAULT_PLAYLIST_HEIGHT = 500;

interface PlaylistOverviewProps {
  playlistId: string;
  height?: number;
}

export const PlaylistOverview: FC<PlaylistOverviewProps> = ({
  playlistId,
  height = DEFAULT_PLAYLIST_HEIGHT,
}) => {
  const { t } = useTranslation('generate');

  const {
    isLoading,
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
  } = usePlaylistIframeLoader({ playlistId });

  if (shouldShowFallback) {
    return (
      <PlaylistOverviewFallback
        height={height}
        handleRetry={handleRetry}
        directUrl={directUrl}
      />
    );
  }

  return (
    <div className="w-full relative">
      {isLoading && <PlaylistOverviewLoading height={height} />}

      {shouldShowRetryInfo && (
        <PlaylistOverviewRetryInfo retryCount={retryCount} />
      )}

      <iframe
        key={`${playlistId}-${key}`}
        src={embedUrl}
        className="rounded"
        width="100%"
        height={height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify embedded playlist"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          display: shouldShowFallback ? 'none' : 'block',
        }}
      />

      {shouldShowSuccessButton && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <a href={directUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              {t('playlistSuccess.openInSpotify')}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};
