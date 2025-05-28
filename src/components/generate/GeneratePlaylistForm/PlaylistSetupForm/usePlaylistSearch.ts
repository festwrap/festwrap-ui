import { useState, useCallback } from 'react';
import { useServices } from '@/contexts/ServiceContext';
import { PlaylistDTO } from '@/entities/playlists';

export function usePlaylistSearch() {
  const { playlistsService } = useServices();
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (name: string, limit: number = 5) => {
      try {
        if (name.trim() === '') {
          setPlaylists([]);
          return;
        }
        setLoading(true);
        const data = await playlistsService.searchPlaylists(name, limit);
        setPlaylists(data.playlists || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [playlistsService]
  );

  return { playlists, loading, error, search };
}
