/* eslint-disable no-unused-vars */
export enum PlaylistType {
  New = 'new',
  Existing = 'existing',
}

export type NewPlaylist = {
  playlistType: PlaylistType.New;
  name: string;
  isPrivate: boolean;
  bands: string[];
};

export type ExistingPlaylist = {
  playlistType: PlaylistType.Existing;
  playlistSelected: string;
  bands: string[];
};

export type Playlist = NewPlaylist | ExistingPlaylist;
