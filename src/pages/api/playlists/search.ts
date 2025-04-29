import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { Playlist, PlaylistDTO } from '@/entities/playlists';
import { PlaylistsClient, PlaylistsHTTPClient } from '@/lib/clients/playlists';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import { createBaseHandler } from '@/lib/handlers/base';

export type SearchPlaylistHandlerParams = {
  client: PlaylistsClient;
  defaultLimit: number;
  maxLimit: number;
};

export type ResponseData = {
  message: string;
  playlists?: Array<PlaylistDTO>;
};

function createSearchQuerySchema(defaultLimit: number, maxLimit: number) {
  const limitMessage = `"limit" should be a number in interval [1, ${maxLimit}]`;
  return z.object({
    name: z.string({
      required_error: '"name" should be provided as a string',
      invalid_type_error: '"name" should be provided as a string',
    }),
    limit: z.coerce
      .number({
        invalid_type_error: limitMessage,
      })
      .min(1, {
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
}: SearchPlaylistHandlerParams) {
  const searchQuerySchema = createSearchQuerySchema(defaultLimit, maxLimit);

  return createBaseHandler<typeof searchQuerySchema._type, ResponseData>({
    validationSchema: searchQuerySchema,
    extractRequestData: (req) => req.query,
    handleRequest: async (requestData, accessToken, response) => {
      const { name, limit } = requestData;

      const searchResults = await client.searchPlaylists(
        accessToken,
        name,
        limit
      );
      response.status(200).json({
        playlists: searchResults.map((playlist: Playlist) =>
          playlist.toPrimitives()
        ),
        message: 'Playlists successfully retrieved',
      });
    },
  });
}

const defaultLimit: number = parseInt(
  process.env.SEARCH_PLAYLISTS_DEFAULT_LIMIT || '5'
);
const maxLimit: number = parseInt(
  process.env.SEARCH_PLAYLISTS_MAX_LIMIT || '10'
);
const serverHost: string = process.env.SERVER_HOST || 'http://localhost';
const serverPort: number = parseInt(process.env.SERVER_PORT || '8080');
const httpClient: HttpClient = new HttpBaseClient();
const httpAuthHeaderBuilder = new BaseAuthHeaderBuilder();
const client: PlaylistsClient = new PlaylistsHTTPClient(
  `${serverHost}:${serverPort}`,
  httpClient,
  httpAuthHeaderBuilder
);
const searchPlaylistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchPlaylistHandler({ client, defaultLimit, maxLimit });
export default searchPlaylistHandler;
