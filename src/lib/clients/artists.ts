import { Artist } from '../artists';
import { AuthClient } from './auth';
import { BaseHTTPClientWithAuth } from './base-backend';
import { HttpClient, Method } from './http';

export interface ArtistsClient {
  searchArtists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Artist[]>;
}

export class ArtistsHTTPBackendClient
  extends BaseHTTPClientWithAuth
  implements ArtistsClient
{
  private url: string;
  private httpClient: HttpClient;

  constructor(url: string, httpClient: HttpClient, authClient?: AuthClient) {
    super(authClient);
    this.url = url;
    this.httpClient = httpClient;
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
}

export class FakeBackendClient implements ArtistsClient {
  private searchArtistError: Error | undefined = undefined;
  private searchArtistResult: Artist[];

  constructor(result: Artist[] = []) {
    this.searchArtistResult = result;
  }

  setResult(result: Artist[]) {
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
}
