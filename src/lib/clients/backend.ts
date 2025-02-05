import { Artist } from '../artists';
import { Playlist } from '../playlists';
import { AuthClient } from './auth';
import { HttpClient, Method } from './http';

export interface BackendClient {
  searchArtists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Artist[]>;
  searchPlaylists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Playlist[]>;
}

export class HTTPBackendClient implements BackendClient {
  private url: string;
  private authClient?: AuthClient | undefined;
  private httpClient: HttpClient;

  constructor(url: string, httpClient: HttpClient, authClient?: AuthClient) {
    this.url = url;
    this.httpClient = httpClient;
    this.authClient = authClient;
  }

  async searchArtists(
    token: string,
    name: string,
    limit: number
  ): Promise<Artist[]> {
    const authHeader = await this.buildAuthHeader();
    const backendAuthHeader = { Authorization: `Bearer ${token}` };
    return this.httpClient
      .send({
        url: `${this.url}/artists/search`,
        method: Method.Get,
        params: { name, limit },
        headers: { ...authHeader, ...backendAuthHeader },
      })
      .then((response) =>
        response.data.map(
          (artist: any) => new Artist(artist.name, artist.imageUri)
        )
      );
  }

  async searchPlaylists(
    token: string,
    name: string,
    limit: number
  ): Promise<Playlist[]> {
    const authHeader = await this.buildAuthHeader();
    const backendAuthHeader = { Authorization: `Bearer ${token}` };
    return this.httpClient
      .send({
        url: `${this.url}/playlists/search`,
        method: Method.Get,
        params: { name, limit },
        headers: { ...authHeader, ...backendAuthHeader },
      })
      .then((response) =>
        response.data.map(
          (playlist: any) =>
            new Playlist(playlist.Name, playlist.Description, playlist.IsPublic)
        )
      );
  }

  private async buildAuthHeader(): Promise<Record<string, string>> {
    if (this.authClient === undefined) {
      return {};
    }

    const authToken = await this.authClient.getToken();
    return {
      [this.authClient.getHeaderName()]: `Bearer ${authToken}`,
    };
  }
}

export class FakeBackendClient implements BackendClient {
  private searchArtistError: Error | undefined = undefined;
  private searchArtistResult: Artist[];

  private searchPlaylistError: Error | undefined = undefined;
  private searchPlaylistResult: Playlist[];

  constructor(result: Artist[] = [], resultPlaylist: Playlist[] = []) {
    this.searchArtistResult = result;
    this.searchPlaylistResult = resultPlaylist;
  }

  setArtistsResult(result: Artist[]) {
    this.searchArtistResult = result;
  }

  setSearchArtistError(error: Error) {
    this.searchArtistError = error;
  }

  async searchArtists(..._: any[]): Promise<Artist[]> {
    if (this.searchArtistError !== undefined) {
      throw this.searchArtistError;
    }
    return this.searchArtistResult;
  }

  setPlaylistsResult(result: Playlist[]) {
    this.searchPlaylistResult = result;
  }

  setSearchPlaylistsError(error: Error) {
    this.searchPlaylistError = error;
  }

  async searchPlaylists(..._: any[]): Promise<Playlist[]> {
    if (this.searchPlaylistError !== undefined) {
      throw this.searchPlaylistError;
    }
    return this.searchPlaylistResult;
  }
}
