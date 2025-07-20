/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistDTO,
} from '@/entities/playlists';
import { useServices } from '@/contexts/service-context';
import { FormSchemaType } from './generate-playlist-form';

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

    const newPlaylistData: CreateNewPlaylistDTO = {
      playlist: {
        name: values.name,
        isPublic: true, // TODO: this will not be configurable in the future, hardcoding for now
      },
      artists: values.artists.map((artist) => ({
        name: artist.name,
      })),
    };

    try {
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
    } finally {
      setIsLoading(false);
    }
    return response;
  };

  return {
    isLoading,
    submitPlaylist,
  };
}
