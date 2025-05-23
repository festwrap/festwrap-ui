import { ResponseData } from '@/pages/api/playlists/search';
import { IFetchService } from './fetchService';
import { CreateNewPlaylistDTO, UpdatePlaylistDTO } from '@/entities/playlists';
import { CreatePlaylistResponseData } from '@/pages/api/playlists/create';
import { UpdatePlaylistResponseData } from '@/pages/api/playlists/update/[playlistId]';

export interface IPlaylistsService {
  searchPlaylists(_name: string, _limit: number): Promise<ResponseData>;
  createNewPlaylist(
    _data: CreateNewPlaylistDTO
  ): Promise<CreatePlaylistResponseData>;
  updatePlaylist(_data: UpdatePlaylistDTO): Promise<UpdatePlaylistResponseData>;
}

export class PlaylistsService implements IPlaylistsService {
  private fetchService: IFetchService;

  constructor(fetchService: IFetchService) {
    this.fetchService = fetchService;
  }

  async searchPlaylists(name: string, limit: number): Promise<ResponseData> {
    const url = `/api/playlists/search?name=${name}&limit=${limit}`;
    return this.fetchService.fetchData<ResponseData>(url);
  }

  async createNewPlaylist(
    data: CreateNewPlaylistDTO
  ): Promise<CreatePlaylistResponseData> {
    const url = '/api/playlists/create';
    return this.fetchService.fetchData<CreatePlaylistResponseData>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlaylist(
    data: UpdatePlaylistDTO
  ): Promise<UpdatePlaylistResponseData> {
    const url = `/api/playlists/update/${data.playlistId}`;
    return this.fetchService.fetchData<UpdatePlaylistResponseData>(url, {
      method: 'PUT',
      body: JSON.stringify({
        artists: data.artists,
      }),
    });
  }
}
