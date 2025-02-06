import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { BackendClient, HTTPBackendClient } from '@/lib/clients/backend';
import { Playlist } from '@/lib/playlists';

export type SearchArtistHandlerParams = {
  client: BackendClient;
  defaultLimit: number;
  maxLimit: number;
};

type ResponsePlaylist = {
  name: string;
  description: string | undefined;
  isPublic: boolean;
};

type ResponseData = {
  message: string;
  playlists?: ResponsePlaylist[];
};

function searchQuerySchema(defaultLimit: number, maxLimit: number) {
  const limitMessage = `"limit" should be a number in interval [1, ${maxLimit}]`;
  return z.object({
    name: z.string({
      message: '"name" should be provided as a string',
    }),
    token: z.string({
      message: '"token" should be provided as a string',
    }),
    limit: z.coerce
      .number({
        message: limitMessage,
      })
      .gt(1, {
        message: limitMessage,
      })
      .lte(maxLimit, {
        message: limitMessage,
      })
      .default(defaultLimit),
  });
}

export function createSearchPlaylistHandler({
  client,
  defaultLimit,
  maxLimit,
}: SearchArtistHandlerParams) {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ResponseData>
  ): Promise<void> {
    const parsedArgs = searchQuerySchema(defaultLimit, maxLimit).safeParse(
      request.query
    );
    if (!parsedArgs.success) {
      response
        .status(400)
        .json({ message: parsedArgs.error.errors[0].message });
      return;
    }

    try {
      const searchResults = await client.searchPlaylists(
        parsedArgs.data.token as string,
        parsedArgs.data.name as string,
        parsedArgs.data.limit
      );
      response.status(200).json({
        playlists: searchResults.map((playlist: Playlist) =>
          playlist.toPrimitives()
        ),
        message: 'Playlists successfully retrieved',
      });
    } catch {
      response
        .status(500)
        .json({ message: 'Unexpected error, cannot retrieve artists' });
    }
  };
}

const defaultLimit: number = parseInt(
  process.env.SEARCH_ARTISTS_DEFAULT_LIMIT || '5'
);
const maxLimit: number = parseInt(process.env.SEARCH_ARTISTS_MAX_LIMIT || '10');
const serverHost: string = process.env.SERVER_HOST || 'http://localhost';
const serverPort: number = parseInt(process.env.SERVER_PORT || '8080');
const httpClient: HttpClient = new HttpBaseClient();
const client: BackendClient = new HTTPBackendClient(
  `${serverHost}:${serverPort}`,
  httpClient
);
const searchPlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchPlaylistHandler({ client, defaultLimit, maxLimit });
export default searchPlaylistHandler;
