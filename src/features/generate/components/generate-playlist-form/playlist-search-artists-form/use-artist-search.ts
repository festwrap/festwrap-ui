import { useState, useCallback } from 'react';
import { useServices } from '@/contexts/service-context';
import { ArtistDTO } from '@/entities/artists';

const DEFAULT_MAX_ARTIST_NAME_LENGTH = 50;

/* eslint-disable no-unused-vars */
export enum ArtistSearchError {
  Standard = 1,
  Unexpected,
  ArtistNameTooLong,
}

export function useArtistSearch(
  maxArtistNameLength: number = DEFAULT_MAX_ARTIST_NAME_LENGTH
) {
  const { artistsService } = useServices();
  const [artists, setArtists] = useState<ArtistDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ArtistSearchError | null>(null);

  function clearArtists() {
    setArtists([]);
  }

  function setResultStatus(result: ArtistDTO[]) {
    setArtists(result);
    setError(null);
  }

  function setErrorStatus(error: ArtistSearchError) {
    setArtists([]);
    setError(error);
  }

  const search = useCallback(
    async (name: string, limit: number = 5) => {
      if (name.trim() === '') {
        setResultStatus([]);
        return;
      } else if (name.length > maxArtistNameLength) {
        setErrorStatus(ArtistSearchError.ArtistNameTooLong);
        return;
      }

      setLoading(true);
      try {
        const data = await artistsService.searchArtists(name, limit);
        setResultStatus(data.artists || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorStatus(ArtistSearchError.Standard);
        } else {
          setErrorStatus(ArtistSearchError.Unexpected);
        }
      }
      setLoading(false);
    },
    [artistsService, maxArtistNameLength]
  );

  return { artists, loading, error, search, clearArtists };
}
