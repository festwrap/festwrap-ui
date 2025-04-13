import { describe, it, vi, expect, beforeEach } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createCreatePlaylistHandler,
  CreatePlaylistHandlerParams,
} from './create';
import { PlaylistsClientStub } from '@/lib/clients/playlists';
import { getToken } from 'next-auth/jwt';
import {
  CreatedPlaylistStatus,
  CreateNewPlaylistResponseDTO,
} from '@/entities/playlists';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

describe('createCreatePlaylistHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getToken).mockResolvedValue({ accessToken: 'mocked-token' });
  });

  function createMockRequest(
    body: any = {
      playlist: {
        name: 'Chill Vibes',
        description: 'Relaxing music',
        isPublic: false,
      },
      artists: [{ name: 'Artist1' }],
    }
  ): NextApiRequest {
    return { body: JSON.stringify(body) } as unknown as NextApiRequest;
  }

  function createMockResponse(): NextApiResponse {
    const response = {} as NextApiResponse;
    response.status = vi.fn().mockReturnValue(response);
    response.json = vi.fn().mockReturnValue(response);
    return response;
  }

  function createHandler(
    { client }: CreatePlaylistHandlerParams = {
      client: new PlaylistsClientStub(),
    }
  ): (_request: NextApiRequest, _response: NextApiResponse) => Promise<void> {
    return createCreatePlaylistHandler({ client });
  }

  it('should return 400 if request body is invalid', async () => {
    const invalidRequest = createMockRequest({ invalidData: true });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should return 400 if playlist name is missing', async () => {
    const invalidRequest = createMockRequest({
      playlist: {
        description: 'Missing name',
        isPublic: false,
        artists: [{ name: 'Artist1' }],
      },
    });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should return 400 if artists array is missing', async () => {
    const invalidRequest = createMockRequest({
      playlist: {
        name: 'Test Playlist',
        description: 'Missing artists',
        isPublic: false,
      },
    });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should create playlist with the provided data', async () => {
    const playlistData = {
      playlist: {
        name: 'New Playlist',
        description: 'A fresh playlist',
        isPublic: true,
      },
      artists: [{ name: 'Artist1' }, { name: 'Artist2' }],
    };
    const request = createMockRequest({
      playlist: playlistData.playlist,
      artists: playlistData.artists,
    });
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'createPlaylist');

    await createHandler({ client })(request, createMockResponse());

    expect(client.createPlaylist).toHaveBeenCalledWith('mocked-token', {
      playlist: {
        name: playlistData.playlist.name,
        description: playlistData.playlist.description,
        isPublic: playlistData.playlist.isPublic,
      },
      artists: playlistData.artists,
    });
  });

  it('should return backend client results with 201 status when creation is successfully without issues', async () => {
    const createdPlaylistResponse: CreateNewPlaylistResponseDTO = {
      id: '123',
      status: CreatedPlaylistStatus.OK,
    };
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'createPlaylist').mockResolvedValue(
      createdPlaylistResponse
    );
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    const expected = {
      playlistCreated: createdPlaylistResponse,
      message: 'Playlists successfully created',
    };

    expect(response.status).toBeCalledWith(201);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return backend client results with 207 status when creation is successfully with issues', async () => {
    const createdPlaylistResponse: CreateNewPlaylistResponseDTO = {
      id: '123',
      status: CreatedPlaylistStatus.MISSING_ARTISTS,
    };
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'createPlaylist').mockResolvedValue(
      createdPlaylistResponse
    );
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    const expected = {
      playlistCreated: createdPlaylistResponse,
      message: 'Playlist has been created but some artists could not be added',
    };

    expect(response.status).toBeCalledWith(207);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return an error if creation fails', async () => {
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'createPlaylist').mockImplementation(() => {
      throw new Error('test error');
    });
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({
      message: 'Unexpected error, cannot create playlist',
    });
  });

  it('should return 401 if token is not provided', async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const response = createMockResponse();

    const handler = createHandler();
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(401);
    expect(response.json).toBeCalledWith({
      message: 'Unauthorized',
    });
  });
});
