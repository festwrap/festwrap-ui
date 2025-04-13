import { useState } from 'react';
import { CreateNewPlaylistDTO } from '@/entities/playlists';
import { useServices } from '@/contexts/ServiceContext';
import {
  FormSchemaType,
  PlaylistCreationMode,
} from '@/components/generate/GeneratePlaylistStepper';

type SubmitPlaylistResponse = {
  success: boolean;
  data?: string | undefined;
};

interface UsePlaylistSubmissionResult {
  isLoading: boolean;
  error: string | null;
  submitPlaylist: (_values: FormSchemaType) => Promise<SubmitPlaylistResponse>;
}

export function usePlaylistSubmission(): UsePlaylistSubmissionResult {
  const { playlistsService } = useServices();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPlaylist = async (
    values: FormSchemaType
  ): Promise<SubmitPlaylistResponse> => {
    const { playlistCreationMode, ...playlistData } = values;

    setIsLoading(true);
    setError(null);

    try {
      if (playlistCreationMode === PlaylistCreationMode.New) {
        const newPlaylistData: CreateNewPlaylistDTO = {
          playlist: {
            name: playlistData.name || '',
            description: playlistData.description,
            isPublic: !playlistData.isPrivate,
          },
          artists: playlistData.artists.map((artist) => ({
            name: artist,
          })),
        };

        const response =
          await playlistsService.createNewPlaylist(newPlaylistData);

        const { playlistCreated } = response;

        return {
          success: true,
          data: playlistCreated?.id,
        };
      } else {
        // Assuming playlistCreationMode is PlaylistCreationMode.Existing
        return {
          success: true,
          data: 'mock-playlist-id',
        };
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit playlist'
      );
      return {
        success: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    submitPlaylist,
  };
}
