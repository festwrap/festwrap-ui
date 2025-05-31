import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PlaylistsClient } from '@/lib/clients/playlists';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistResponseDTO,
} from '@/entities/playlists';
import { createBaseHandler } from '@/lib/handlers/base';
import { PLAYLISTS_CLIENT } from '@/lib/config';

export type CreatePlaylistHandlerParams = {
  client: PlaylistsClient;
};

export type CreatePlaylistResponseData = {
  message: string;
  playlistCreated?: CreateNewPlaylistResponseDTO;
};

const createNewPlaylistSchema = z.object({
  playlist: z.object({
    name: z.string(),
    isPublic: z.boolean(),
  }),
  artists: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export function createCreatePlaylistHandler({
  client,
}: CreatePlaylistHandlerParams) {
  return createBaseHandler<
    typeof createNewPlaylistSchema._type,
    CreatePlaylistResponseData
  >({
    validationSchema: createNewPlaylistSchema,
    extractRequestData: (req) => req.body,
    handleRequest: async (requestData, accessToken, response) => {
      const { playlist, artists } = requestData;
      const playlistData = { playlist, artists };

      const playlistCreated = await client.createPlaylist(
        accessToken,
        playlistData
      );

      if (playlistCreated.status === CreatedPlaylistStatus.MISSING_ARTISTS) {
        response.status(207).json({
          playlistCreated,
          message:
            'Playlist has been created but some artists could not be added',
        });
        return;
      }

      response.status(201).json({
        playlistCreated,
        message: 'Playlists successfully created',
      });
    },
  });
}

const createPlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createCreatePlaylistHandler({ client: PLAYLISTS_CLIENT });
export default createPlaylistHandler;
