import {
  CreatedPlaylistStatus,
  CreateNewPlaylistResponseDTO,
  CreateNewPlaylistDTO,
} from '@/entities/playlists';
import { AuthHeaderBuilder, BaseAuthHeaderBuilder } from './auth';
import { HttpClient, Method } from './http';

export interface PlaylistsClient {
  createPlaylist(
    _playlist: CreateNewPlaylistDTO
  ): Promise<CreateNewPlaylistResponseDTO>;
}

export class PlaylistsHTTPClient implements PlaylistsClient {
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

  async createPlaylist(
    playlist: CreateNewPlaylistDTO
  ): Promise<CreateNewPlaylistResponseDTO> {
    const authHeader = await this.httpAuthHeaderBuilder.buildHeader();
    const response = await this.httpClient.send({
      url: `${this.url}/playlists`,
      method: Method.Post,
      data: playlist,
      headers: authHeader,
    });
    if (response.status === 201) {
      return {
        id: response.data.playlist.id,
        status: CreatedPlaylistStatus.OK,
      };
    } else if (response.status === 207) {
      return {
        id: response.data.playlist.id,
        status: CreatedPlaylistStatus.MISSING_ARTISTS,
      };
    } else {
      throw new Error(
        `Unexpected playlist create response status: ${response.status}: ${response.data}`
      );
    }
  }
}

export class PlaylistsClientStub implements PlaylistsClient {
  private createPlaylistResult: CreateNewPlaylistResponseDTO;

  constructor(
    createPlaylistResult: CreateNewPlaylistResponseDTO = {
      id: '1',
      status: CreatedPlaylistStatus.OK,
    }
  ) {
    this.createPlaylistResult = createPlaylistResult;
  }

  async createPlaylist(..._: any[]): Promise<any> {
    return this.createPlaylistResult;
  }
}
