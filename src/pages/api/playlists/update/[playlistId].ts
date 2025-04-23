import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { PlaylistsClient, PlaylistsHTTPClient } from '@/lib/clients/playlists';
import { getToken } from 'next-auth/jwt';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import {
  CreatedPlaylistStatus,
  UpdatePlaylistResponseDTO,
} from '@/entities/playlists';

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
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<UpdatePlaylistResponseData>
  ): Promise<void> {
    const queryParams = request.query;
    const body = request.body;

    const parsedArgs = updatePlaylistSchema.safeParse({
      ...body,
      ...queryParams,
    });

    if (!parsedArgs.success) {
      response
        .status(400)
        .json({ message: parsedArgs.error.errors[0].message });
      return;
    }

    const token = await getToken({ req: request });

    if (!token) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { playlistId, artists } = parsedArgs.data;

    const playlistData = {
      playlistId,
      artists,
    };

    try {
      const playlistCreated = await client.updatePlaylist(
        token.accessToken,
        playlistData
      );

      if (playlistCreated.status === CreatedPlaylistStatus.MISSING_ARTISTS) {
        response.status(207).json({
          playlistUpdated: playlistCreated,
          message:
            'Playlist has been updated but some artists could not be added',
        });
        return;
      }

      response.status(200).json({
        playlistUpdated: playlistCreated,
        message: 'Playlists successfully updated',
      });
    } catch (error) {
      response
        .status(500)
        .json({ message: 'Unexpected error, cannot update playlist' });
    }
  };
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
