/* eslint-disable no-unused-vars */
export enum GeneratePlaylistType {
  New = 'new',
  Existing = 'existing',
}

export type GenerateNewPlaylist = {
  playlistType: GeneratePlaylistType.New;
  name: string;
  isPrivate: boolean;
  bands: string[];
};

export type GenerateExistingPlaylist = {
  playlistType: GeneratePlaylistType.Existing;
  playlistSelected: string;
  bands: string[];
};

export type GeneratePlaylistDTO =
  | GenerateNewPlaylist
  | GenerateExistingPlaylist;

export type PlaylistDTO = {
  id: string;
  name: string;
  description: string | undefined;
  isPublic: boolean;
};

export class Playlist {
  private id: string;
  private name: string;
  private description: string | undefined = undefined;
  private isPublic: boolean;

  constructor(
    id: string,
    name: string,
    isPublic: boolean,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.isPublic = isPublic;
    this.description = description;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getIsPublic(): boolean {
    return this.isPublic;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isPublic: this.isPublic,
    };
  }
}
