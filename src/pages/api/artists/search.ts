import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { Artist, ArtistDTO } from '@/entities/artists';
import { ArtistsClient, ArtistsHTTPClient } from '@/lib/clients/artists';
import { BaseAuthHeaderBuilder } from '@/lib/clients/auth';
import { createBaseHandler } from '@/lib/handlers/base';

export type SearchArtistHandlerParams = {
  client: ArtistsClient;
  defaultLimit: number;
  maxLimit: number;
};

export type ResponseData = {
  message: string;
  artists?: Array<ArtistDTO>;
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

export function createSearchArtistHandler({
  client,
  defaultLimit,
  maxLimit,
}: SearchArtistHandlerParams) {
  const searchQuerySchema = createSearchQuerySchema(defaultLimit, maxLimit);

  return createBaseHandler<typeof searchQuerySchema._type, ResponseData>({
    validationSchema: searchQuerySchema,
    extractRequestData: (req) => req.query,
    handleRequest: async (requestData, accessToken, response) => {
      const { name, limit } = requestData;

      const searchResults = await client.searchArtists(
        accessToken,
        name,
        limit
      );
      response.status(200).json({
        artists: searchResults.map((artist: Artist) => ({
          name: artist.getName(),
          imageUri: artist.getImageUri(),
        })),
        message: 'Artists successfully retrieved',
      });
    },
  });
}

const defaultLimit: number = parseInt(
  process.env.SEARCH_ARTISTS_DEFAULT_LIMIT || '5'
);
const maxLimit: number = parseInt(process.env.SEARCH_ARTISTS_MAX_LIMIT || '10');
const serverHost: string = process.env.SERVER_HOST || 'http://localhost';
const serverPort: number = parseInt(process.env.SERVER_PORT || '8080');
const httpClient: HttpClient = new HttpBaseClient();
const httpAuthHeaderBuilder = new BaseAuthHeaderBuilder();
const client: ArtistsClient = new ArtistsHTTPClient(
  `${serverHost}:${serverPort}`,
  httpClient,
  httpAuthHeaderBuilder
);
const searchArtistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchArtistHandler({ client, defaultLimit, maxLimit });
export default searchArtistHandler;
