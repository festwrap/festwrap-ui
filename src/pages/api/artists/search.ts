import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { Artist, ArtistDTO } from '@/entities/artists';
import { ArtistsClient } from '@/lib/clients/artists';
import { createBaseHandler } from '@/lib/handlers/base';
import { ARTISTS_CLIENT } from '@/lib/config';

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
const searchArtistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchArtistHandler({
  client: ARTISTS_CLIENT,
  defaultLimit,
  maxLimit,
});
export default searchArtistHandler;
