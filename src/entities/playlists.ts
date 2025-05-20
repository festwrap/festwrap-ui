/* eslint-disable no-unused-vars */
export const MAX_ARTISTS = 5;

export type CreateNewPlaylistDTO = {
  playlist: {
    name: string;
    description?: string | undefined;
    isPublic: boolean;
  };
  artists: Array<{
    name: string;
  }>;
};

export type UpdatePlaylistDTO = {
  playlistId: string;
  artists: Array<{
    name: string;
  }>;
};

export enum CreatedPlaylistStatus {
  OK = 'OK',
  MISSING_ARTISTS = 'MISSING_ARTISTS',
}

export type CreateNewPlaylistResponseDTO = {
  id: string;
  status: CreatedPlaylistStatus;
};

export type UpdatePlaylistResponseDTO = {
  status: CreatedPlaylistStatus;
};

export type PlaylistDTO = {
  id: string;
  name: string;
  description?: string | undefined;
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
