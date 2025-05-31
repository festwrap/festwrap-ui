import { HttpBaseClient } from './clients/http';
import { BaseAuthHeaderBuilder, GCPAuthClient } from './clients/auth';
import { ArtistsHTTPClient } from './clients/artists';
import { PlaylistsHTTPClient } from './clients/playlists';

export const PLAYLISTS = {
  search: {
    defaultLimit: parseInt(process.env.SEARCH_PLAYLISTS_DEFAULT_LIMIT || '5'),
    maxLimit: parseInt(process.env.SEARCH_PLAYLISTS_MAX_LIMIT || '10'),
  },
};

const SERVER = {
  host: process.env.SERVER_HOST || 'http://localhost',
  port: parseInt(process.env.SERVER_PORT || '8080'),
};

const ENV = process.env.ENV || 'prod';

export const HTTP_CLIENT = new HttpBaseClient();
export const GCP_CLIENT =
  ENV === 'prod' ? new GCPAuthClient(HTTP_CLIENT, SERVER.host) : undefined;

export const AUTH_HEADER_BUILDER = new BaseAuthHeaderBuilder(GCP_CLIENT);

export const ARTISTS_CLIENT = new ArtistsHTTPClient(
  `${SERVER.host}:${SERVER.port}`,
  HTTP_CLIENT,
  AUTH_HEADER_BUILDER
);

export const PLAYLISTS_CLIENT = new PlaylistsHTTPClient(
  `${SERVER.host}:${SERVER.port}`,
  HTTP_CLIENT,
  AUTH_HEADER_BUILDER
);
