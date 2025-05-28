/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistDTO,
  UpdatePlaylistDTO,
} from '@/entities/playlists';
import { useServices } from '@/contexts/ServiceContext';
import {
  FormSchemaType,
  PlaylistCreationMode,
} from '@/components/generate/GeneratePlaylistForm/GeneratePlaylistForm';

export enum SubmissionStatus {
  OK,
  PARTIAL_ERRORS,
  ERROR,
}

type SubmitPlaylistResponse = {
  status: SubmissionStatus;
  playlistId?: string | undefined;
};

interface UsePlaylistSubmissionResult {
  isLoading: boolean;
  submitPlaylist: (_values: FormSchemaType) => Promise<SubmitPlaylistResponse>;
}

function dtoStatusToSubmissionStatus(
  status?: CreatedPlaylistStatus
): SubmissionStatus {
  switch (status) {
    case CreatedPlaylistStatus.OK:
      return SubmissionStatus.OK;
    case CreatedPlaylistStatus.MISSING_ARTISTS:
      return SubmissionStatus.PARTIAL_ERRORS;
    default:
      return SubmissionStatus.ERROR;
  }
}

export function usePlaylistSubmission(): UsePlaylistSubmissionResult {
  const { playlistsService } = useServices();
  const [isLoading, setIsLoading] = useState(false);

  const submitPlaylist = async (
    values: FormSchemaType
  ): Promise<SubmitPlaylistResponse> => {
    let response: SubmitPlaylistResponse;

    setIsLoading(true);

    if (values.playlistCreationMode === PlaylistCreationMode.New) {
      try {
        const newPlaylistData: CreateNewPlaylistDTO = {
          playlist: {
            name: values.name,
            isPublic: values.isPublic,
          },
          artists: values.artists.map((artist) => ({
            name: artist.name,
          })),
        };

        const serviceResponse =
          await playlistsService.createNewPlaylist(newPlaylistData);

        const { playlistCreated } = serviceResponse;

        response = {
          status: dtoStatusToSubmissionStatus(playlistCreated?.status),
          playlistId: playlistCreated?.id,
        };
      } catch (error) {
        response = {
          status: SubmissionStatus.ERROR,
        };
      }
    } else if (values.playlistCreationMode === PlaylistCreationMode.Existing) {
      try {
        const existingPlaylistData: UpdatePlaylistDTO = {
          playlistId: values.playlistSelected.id,
          artists: values.artists.map((artist) => ({
            name: artist.name,
          })),
        };

        const serviceResponse =
          await playlistsService.updatePlaylist(existingPlaylistData);

        const { playlistUpdated } = serviceResponse;

        response = {
          playlistId: values.playlistSelected.id,
          status: dtoStatusToSubmissionStatus(playlistUpdated?.status),
        };
      } catch (error) {
        response = {
          status: SubmissionStatus.ERROR,
        };
      }
    } else {
      response = {
        status: SubmissionStatus.ERROR,
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
