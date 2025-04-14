import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { PlaylistsClient, PlaylistsHTTPClient } from '@/lib/clients/playlists';
import { getToken } from 'next-auth/jwt';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistResponseDTO,
} from '@/entities/playlists';

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
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<CreatePlaylistResponseData>
  ): Promise<void> {
    const body = JSON.parse(request.body);
    const parsedArgs = createNewPlaylistSchema.safeParse(body);

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

    const { playlist, artists } = parsedArgs.data;

    const playlistData = {
      playlist,
      artists,
    };

    try {
      const playlistCreated = await client.createPlaylist(
        token.accessToken,
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
    } catch {
      response
        .status(500)
        .json({ message: 'Unexpected error, cannot create playlist' });
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
const createPlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createCreatePlaylistHandler({ client });
export default createPlaylistHandler;
