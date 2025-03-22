import { Artist } from '../../entities/artists';
import { AuthHeaderBuilder, BaseAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface ArtistsClient {
  searchArtists(
    _token: string,
    _name: string,
    _limit: number
  ): Promise<Artist[]>;
}

export class ArtistsHTTPClient implements ArtistsClient {
  private url: string;
  private httpClient: HttpClient;
  private httpAuthHeaderBuilder: AuthHeaderBuilder;

  constructor(
    url: string,
    httpClient: HttpClient,
    httpAuthHeaderBuilder: BaseAuthHeaderBuilder
  ) {
    this.url = url;
    this.httpClient = httpClient;
    this.httpAuthHeaderBuilder = httpAuthHeaderBuilder;
  }

  async searchArtists(
    token: string,
    name: string,
    limit: number
  ): Promise<Artist[]> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader(token);
    return this.httpClient
      .send({
        url: `${this.url}/artists/search`,
        method: Method.Get,
        params: { name, limit },
        headers: authHeader,
      })
      .then((response) =>
        response.data.map(
          (artist: any) => new Artist(artist.name, artist.imageUri)
        )
      );
  }
}

export class ArtistsClientStub implements ArtistsClient {
  private searchArtistResult: Artist[];

  constructor(result: Artist[] = []) {
    this.searchArtistResult = result;
  }

  async searchArtists(..._: any[]): Promise<Artist[]> {
    return this.searchArtistResult;
  }
}
