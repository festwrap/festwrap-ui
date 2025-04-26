import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { PlaylistsClient, PlaylistsHTTPClient } from '@/lib/clients/playlists';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistResponseDTO,
} from '@/entities/playlists';
import { createBaseHandler } from '@/lib/handlers/createBaseHandler';

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
    description: z.string(),
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

const serverHost: string = process.env.SERVER_HOST || 'http://localhost';
const serverPort: number = parseInt(process.env.SERVER_PORT || '8080');
const httpClient: HttpClient = new HttpBaseClient();
const httpAuthHeaderBuilder = new BaseAuthHeaderBuilder();
const client: PlaylistsClient = new PlaylistsHTTPClient(
  `${serverHost}:${serverPort}`,
  httpClient,
  httpAuthHeaderBuilder
);
const createPlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createCreatePlaylistHandler({ client });
export default createPlaylistHandler;
