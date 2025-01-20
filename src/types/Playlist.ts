export enum PlaylistType {
  New = 'new',
  Existing = 'existing',
}

export interface NewPlaylist {
  playlistType: PlaylistType.New;
  name: string;
  isPrivate: boolean;
  bands: string[];
}

export interface ExistingPlaylist {
  playlistType: PlaylistType.Existing;
  playlistSelected: string;
  bands: string[];
}

export type Playlist = NewPlaylist | ExistingPlaylist;
