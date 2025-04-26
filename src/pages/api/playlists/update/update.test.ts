import { describe, it, vi, expect, beforeEach } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createUpdatePlaylistHandler,
  UpdatePlaylistHandlerParams,
} from './[playlistId]';
import { PlaylistsClientStub } from '@/lib/clients/playlists';
import { getToken } from 'next-auth/jwt';
import {
  CreatedPlaylistStatus,
  UpdatePlaylistResponseDTO,
} from '@/entities/playlists';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

describe('createUpdatePlaylistHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getToken).mockResolvedValue({ accessToken: 'mocked-token' });
  });

  function createMockRequest(
    body: any = {
      playlistId: 'playlist123',
      artists: [{ name: 'Artist1' }],
    }
  ): NextApiRequest {
    return {
      body,
      query: {},
    } as unknown as NextApiRequest;
  }

  function createMockResponse(): NextApiResponse {
    const response = {} as NextApiResponse;
    response.status = vi.fn().mockReturnValue(response);
    response.json = vi.fn().mockReturnValue(response);
    return response;
  }

  function createHandler(
    { client }: UpdatePlaylistHandlerParams = {
      client: new PlaylistsClientStub(),
    }
  ): (_request: NextApiRequest, _response: NextApiResponse) => Promise<void> {
    return createUpdatePlaylistHandler({ client });
  }

  it('should return 400 if request body is invalid', async () => {
    const invalidRequest = createMockRequest({ invalidData: true });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should return 400 if playlistId is missing', async () => {
    const invalidRequest = createMockRequest({
      artists: [{ name: 'Artist1' }],
    });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should return 400 if artists array is missing', async () => {
    const invalidRequest = createMockRequest({
      playlistId: 'playlist123',
    });
    const response = createMockResponse();

    await createHandler()(invalidRequest, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalled();
  });

  it('should update playlist with the provided data', async () => {
    const playlistData = {
      playlistId: 'playlist123',
      artists: [{ name: 'Artist1' }, { name: 'Artist2' }],
    };
    const request = createMockRequest(playlistData);
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'updatePlaylist');

    await createHandler({ client })(request, createMockResponse());

    expect(client.updatePlaylist).toHaveBeenCalledWith('mocked-token', {
      playlistId: playlistData.playlistId,
      artists: playlistData.artists,
    });
  });

  it('should return backend client results with 200 status when update is successful without issues', async () => {
    const updatedPlaylistResponse: UpdatePlaylistResponseDTO = {
      status: CreatedPlaylistStatus.OK,
    };
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'updatePlaylist').mockResolvedValue(
      updatedPlaylistResponse
    );
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    const expected = {
      playlistUpdated: updatedPlaylistResponse,
      message: 'Playlists successfully updated',
    };

    expect(response.status).toBeCalledWith(200);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return backend client results with 207 status when update is successful with issues', async () => {
    const updatedPlaylistResponse: UpdatePlaylistResponseDTO = {
      status: CreatedPlaylistStatus.MISSING_ARTISTS,
    };
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'updatePlaylist').mockResolvedValue(
      updatedPlaylistResponse
    );
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    const expected = {
      playlistUpdated: updatedPlaylistResponse,
      message: 'Playlist has been updated but some artists could not be added',
    };

    expect(response.status).toBeCalledWith(207);
    expect(response.json).toBeCalledWith(expected);
  });

  it('should return an error if update fails', async () => {
    const client = new PlaylistsClientStub();
    vi.spyOn(client, 'updatePlaylist').mockImplementation(() => {
      throw new Error('test error');
    });
    const response = createMockResponse();

    const handler = createHandler({ client });
    await handler(createMockRequest(), response);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith({
      message: 'Unexpected error occurred',
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
