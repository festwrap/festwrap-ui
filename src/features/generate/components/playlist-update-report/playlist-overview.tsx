import { FC, useEffect, useState, useRef } from 'react';

interface PlaylistOverviewProps {
  playlistId: string;
  height?: number;
  maxReloads?: number;
  initialReloadDelayMs?: number;
}

export const PlaylistOverview: FC<PlaylistOverviewProps> = ({
  playlistId,
  height = 500,
  maxReloads = 1,
  initialReloadDelayMs = 1000,
}) => {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;

  const [reloads, setReloads] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reloads >= maxReloads) return;

    const nextExpReload = initialReloadDelayMs * Math.pow(2, reloads);
    timerRef.current = window.setTimeout(() => {
      setReloads(reloads + 1);
    }, nextExpReload);

    return () => {
      if (timerRef.current !== null) {
        // Clean resources on exit
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [reloads, initialReloadDelayMs, maxReloads]);

  return (
    <iframe
      key={`${playlistId}-${reloads}`}
      src={embedUrl}
      className="rounded"
      width="100%"
      height={height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      title="Spotify embedded playlist"
    />
  );
};
