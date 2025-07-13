import { IFetchService } from './fetch-service';
import { CreateNewPlaylistDTO } from '@/entities/playlists';
import { CreatePlaylistResponseData } from '@/pages/api/playlists/create';

export interface IPlaylistsService {
  createNewPlaylist(
    _data: CreateNewPlaylistDTO
  ): Promise<CreatePlaylistResponseData>;
}

export class PlaylistsService implements IPlaylistsService {
  private fetchService: IFetchService;

  constructor(fetchService: IFetchService) {
    this.fetchService = fetchService;
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
}
