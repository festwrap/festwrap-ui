import { Artist } from '../artists';
import { AuthClient } from './auth';
import { HttpClient, Method } from './http';

export interface BackendClient {
  searchArtists(_token: string, _name: string, _limit: number): Promise<Artist>;
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
  ): Promise<Artist> {
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
