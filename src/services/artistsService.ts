import { ResponseData } from '@/pages/api/artists/search';
import { IFetchService } from './fetchService';

export interface IArtistsService {
  searchArtists(_name: string, _limit: number): Promise<ResponseData>;
}

export class ArtistsService implements IArtistsService {
  private fetchService: IFetchService;

  constructor(fetchService: IFetchService) {
    this.fetchService = fetchService;
  }

  async searchArtists(name: string, limit: number): Promise<ResponseData> {
    const url = `/api/artists/search?name=${name}&limit=${limit}`;
    return this.fetchService.fetchData<ResponseData>(url);
  }
}
