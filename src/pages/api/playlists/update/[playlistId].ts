import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { PlaylistsClient, PlaylistsHTTPClient } from '@/lib/clients/playlists';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import {
  CreatedPlaylistStatus,
  UpdatePlaylistResponseDTO,
} from '@/entities/playlists';
import { createBaseHandler } from '@/lib/handlers/createBaseHandler';

export type UpdatePlaylistHandlerParams = {
  client: PlaylistsClient;
};

export type UpdatePlaylistResponseData = {
  message: string;
  playlistUpdated?: UpdatePlaylistResponseDTO;
};

const updatePlaylistSchema = z.object({
  playlistId: z.string(),
  artists: z.array(
    z.object({
      name: z.string(),
    })
  ),
});

export function createUpdatePlaylistHandler({
  client,
}: UpdatePlaylistHandlerParams) {
  return createBaseHandler<
    typeof updatePlaylistSchema._type,
    UpdatePlaylistResponseData
  >({
    validationSchema: updatePlaylistSchema,
    extractRequestData: (req) => ({ ...req.body, ...req.query }),
    handleRequest: async (requestData, accessToken, response) => {
      const { playlistId, artists } = requestData;
      const playlistData = { playlistId, artists };

      const playlistUpdated = await client.updatePlaylist(
        accessToken,
        playlistData
      );

      if (playlistUpdated.status === CreatedPlaylistStatus.MISSING_ARTISTS) {
        response.status(207).json({
          playlistUpdated,
          message:
            'Playlist has been updated but some artists could not be added',
        });
        return;
      }

      response.status(200).json({
        playlistUpdated,
        message: 'Playlists successfully updated',
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
const updatePlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createUpdatePlaylistHandler({ client });
export default updatePlaylistHandler;
