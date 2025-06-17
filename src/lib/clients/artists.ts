import { Artist } from '@/entities/artists';
import { AuthHeaderBuilder, BaseAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface ArtistsClient {
  searchArtists(_name: string, _limit: number): Promise<Artist[]>;
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

  async searchArtists(name: string, limit: number): Promise<Artist[]> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader();
    const response = await this.httpClient.send({
      url: `${this.url}/artists/search`,
      method: Method.Get,
      params: { name, limit },
      headers: authHeader,
    });
    if (response.status === 200) {
      return response.data.map(
        (artist: any) => new Artist(artist.name, artist.imageUri)
      );
    } else {
      throw new Error(
        `Unexpected artist search response status: ${response.status}: ${response.data}`
      );
    }
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
