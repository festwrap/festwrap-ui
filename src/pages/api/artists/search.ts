import type { NextApiRequest, NextApiResponse } from 'next';
import { HttpClient, HttpBaseClient } from '@/lib/clients/http';
import { Artist } from '@/lib/artists';
import { BackendClient, HTTPBackendClient } from '@/lib/clients/backend';

export type SearchArtistHandlerParams = {
  client: BackendClient;
  defaultLimit: number;
  maxLimit: number;
};

type ResponseArtist = {
  name: string;
  imageUri: string | undefined;
};

type ResponseData = {
  message: string;
  artists?: ResponseArtist[];
};

export function createSearchArtistHandler({
  client,
  defaultLimit,
  maxLimit,
}: SearchArtistHandlerParams) {
  return async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ResponseData>
  ): Promise<void> {
    const { name, token, limit } = request.query;

    let parsedLimit: number;
    try {
      parsedLimit = parseParamNumberWithDefault(
        limit,
        defaultLimit,
        maxLimit,
        'limit'
      );
    } catch (e) {
      response.status(400).json({ message: (e as Error).message });
      return;
    }

    if (typeof name !== 'string') {
      response
        .status(400)
        .json({ message: '"name" should be provided as a string' });
      return;
    }

    if (typeof token !== 'string') {
      response
        .status(400)
        .json({ message: '"token" should be provided as a string' });
      return;
    }

    try {
      const searchResults = await client.searchArtists(
        token as string,
        name as string,
        parsedLimit
      );
      response.status(200).json({
        artists: searchResults.map((artist: Artist) => ({
          name: artist.getName(),
          imageUri: artist.getImageUri(),
        })),
        message: 'Artists successfully retrieved',
      });
    } catch {
      response
        .status(500)
        .json({ message: 'Unexpected error, cannot retrieve artists' });
    }
  };
}

function parseParamNumberWithDefault(
  value: any,
  defaultValue: number,
  maxValue: number,
  paramName: string
) {
  let parsed = defaultValue;
  if (value !== undefined) {
    parsed = parseInt(value as string);
    if (isNaN(parsed) || parsed < 1 || parsed > maxValue) {
      throw Error(
        `"${paramName}" should be a number in interval [1, ${maxValue}]`
      );
    }
  }
  return parsed;
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
const searchArtistHandler: (
  _request: NextApiRequest,
  _response: NextApiResponse
) => void = createSearchArtistHandler({ client, defaultLimit, maxLimit });
export default searchArtistHandler;
