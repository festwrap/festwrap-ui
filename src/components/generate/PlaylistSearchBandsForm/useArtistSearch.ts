import { useState, useCallback } from 'react';
import { useServices } from '@/contexts/ServiceContext';
import { ArtistDTO } from '@/entities/artists';

export function useArtistSearch() {
  const { artistsService } = useServices();
  const [artists, setArtists] = useState<ArtistDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (name: string, limit: number = 5) => {
      try {
        if (name.trim() === '') {
          setArtists([]);
          return;
        }
        setLoading(true);
        const data = await artistsService.searchArtists(name, limit);
        console.log(data);
        setArtists(data.artists || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [artistsService]
  );

  return { artists, loading, error, search };
}
