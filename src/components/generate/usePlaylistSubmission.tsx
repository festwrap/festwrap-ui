import { useState } from 'react';
import { CreateNewPlaylistDTO, UpdatePlaylistDTO } from '@/entities/playlists';
import { useServices } from '@/contexts/ServiceContext';
import {
  FormSchemaType,
  PlaylistCreationMode,
} from '@/components/generate/GeneratePlaylistStepper';

type SubmitPlaylistResponse = {
  success: boolean;
  data?: string | undefined;
  errorKey?: string;
};

interface UsePlaylistSubmissionResult {
  isLoading: boolean;
  submitPlaylist: (_values: FormSchemaType) => Promise<SubmitPlaylistResponse>;
}

export function usePlaylistSubmission(): UsePlaylistSubmissionResult {
  const { playlistsService } = useServices();
  const [isLoading, setIsLoading] = useState(false);

  const submitPlaylist = async (
    values: FormSchemaType
  ): Promise<SubmitPlaylistResponse> => {
    const { playlistCreationMode, ...playlistData } = values;
    let response: SubmitPlaylistResponse;

    setIsLoading(true);

    if (playlistCreationMode === PlaylistCreationMode.New) {
      try {
        const newPlaylistData: CreateNewPlaylistDTO = {
          playlist: {
            name: playlistData.name || '',
            description: playlistData.description,
            isPublic: playlistData.isPublic,
          },
          artists: playlistData.artists.map((artist) => ({
            name: artist,
          })),
        };

        const serviceResponse =
          await playlistsService.createNewPlaylist(newPlaylistData);

        const { playlistCreated } = serviceResponse;

        response = {
          success: true,
          data: playlistCreated?.id,
        };
      } catch (error) {
        response = {
          success: false,
          errorKey: 'steps.errors.createNewPlaylist.unexpectedError',
        };
      }
    } else if (playlistCreationMode === PlaylistCreationMode.Existing) {
      try {
        const existingPlaylistData: UpdatePlaylistDTO = {
          playlistId: playlistData.playlistSelected?.id || '',
          artists: playlistData.artists.map((artist) => ({
            name: artist,
          })),
        };

        await playlistsService.updatePlaylist(existingPlaylistData);

        response = {
          success: true,
          data: playlistData.playlistSelected?.id,
        };
      } catch (error) {
        response = {
          success: false,
          errorKey: 'steps.errors.existingPlaylist.unexpectedError',
        };
      }
    } else {
      response = {
        success: false,
        errorKey: 'steps.errors.unexpectedError',
      };
    }

    setIsLoading(false);
    return response;
  };

  return {
    isLoading,
    submitPlaylist,
  };
}
