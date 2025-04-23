import { beforeEach, describe, it, expect, vi } from 'vitest';
import {
  CreatedPlaylistStatus,
  UpdatePlaylistDTO,
  Playlist,
  CreateNewPlaylistDTO,
} from '@/entities/playlists';
import { PlaylistsHTTPClient } from './playlists';
import { FakeHttpClient, HttpResponse, Method } from './http';
import { AuthHeaderBuilderStub, AuthHeaderBuilder } from './auth';

describe('PlaylistsHTTPClient', () => {
  describe('searchPlaylists', () => {
    let url: string;
    let token: string;
    let name: string;
    let limit: number;
    let httpClient: FakeHttpClient;
    let response: HttpResponse;
    let authHeaderBuilder: AuthHeaderBuilder;

    beforeEach(() => {
      url = 'http://some_url';
      token = 'my-token';
      name = 'Chill';
      limit = 5;
      response = {
        data: [
          {
            id: '1',
            name: 'Chill Vibes',
            description: 'Some description',
            isPublic: true,
          },
          {
            id: '2',
            name: 'Chill Hits',
            description: 'Some description',
            isPublic: true,
          },
        ],
        status: 200,
      };
      httpClient = new FakeHttpClient(response);
      authHeaderBuilder = new AuthHeaderBuilderStub();
    });

    it('should call the client with the correct parameters', async () => {
      const headers = { something: 'value' };
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        new AuthHeaderBuilderStub(headers)
      );
      vi.spyOn(httpClient, 'send');

      await client.searchPlaylists(token, name, limit);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists/search`,
        method: Method.Get,
        params: { name: name, limit: limit },
        headers: headers,
      });
    });

    it('should return the list of playlists returned by the HTTP client', async () => {
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      const actual = await client.searchPlaylists(token, name, limit);

      const expected = [
        new Playlist('1', 'Chill Vibes', true, 'Some description'),
        new Playlist('2', 'Chill Hits', true, 'Some description'),
      ];
      expect(actual).toEqual(expected);
    });

    it('should throw an error if the HTTP client fails', async () => {
      const errorMessage = 'Request failed';
      httpClient.setSendErrorMessage(errorMessage);
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(client.searchPlaylists(token, name, limit)).rejects.toThrow(
        errorMessage
      );
    });

    it('should throw an error if the header builder fails', async () => {
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('test Error');
      });
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(
        client.searchPlaylists(token, name, limit)
      ).rejects.toThrow();
    });

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal error' },
    ])(
      'should throw an error if the server response status is not the expected successful one',
      async ({ status, message }) => {
        response = { status: status, data: message };
        httpClient = new FakeHttpClient(response);
        const client = new PlaylistsHTTPClient(
          url,
          httpClient,
          authHeaderBuilder
        );

        const expectedMessage = `Unexpected playlist search response status: ${status}: ${message}`;
        await expect(
          client.searchPlaylists(token, name, limit)
        ).rejects.toThrow(expectedMessage);
      }
    );
  });

  describe('createPlaylist', () => {
    let url: string;
    let token: string;
    let playlistData: CreateNewPlaylistDTO;
    let httpClient: FakeHttpClient;
    let response: HttpResponse;
    let authHeaderBuilder: AuthHeaderBuilder;

    beforeEach(() => {
      url = 'http://some_url';
      token = 'my-token';
      playlistData = {
        playlist: {
          name: 'Festival Hits',
          description: 'All the best songs',
          isPublic: false,
        },
        artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }],
      };
      authHeaderBuilder = new AuthHeaderBuilderStub();
    });

    const mockHttpClientResponse = (status: number = 201) => {
      response = {
        data: {
          playlist: {
            id: '123',
          },
        },
        status,
      };
      httpClient = new FakeHttpClient(response);
    };

    it('should call the client with the correct parameters', async () => {
      mockHttpClientResponse();
      const headers = { authorization: 'Bearer token' };
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        new AuthHeaderBuilderStub(headers)
      );
      vi.spyOn(httpClient, 'send');

      await client.createPlaylist(token, playlistData);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists`,
        method: Method.Post,
        data: playlistData,
        headers: headers,
      });
    });

    it.each([
      { status: 201, expectedStatus: CreatedPlaylistStatus.OK },
      { status: 207, expectedStatus: CreatedPlaylistStatus.MISSING_ARTISTS },
    ])(
      'should return the response data with the correct status when HTTP status is $status',
      async ({ status, expectedStatus }) => {
        mockHttpClientResponse(status);
        const client = new PlaylistsHTTPClient(
          url,
          httpClient,
          authHeaderBuilder
        );

        const result = await client.createPlaylist(token, playlistData);

        const expectedResponse = {
          id: response.data.playlist.id,
          status: expectedStatus,
        };
        expect(result).toEqual(expectedResponse);
      }
    );

    it('should throw an error if the HTTP client fails', async () => {
      mockHttpClientResponse();
      const errorMessage = 'Failed to create playlist';
      httpClient.setSendErrorMessage(errorMessage);
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(client.createPlaylist(token, playlistData)).rejects.toThrow(
        errorMessage
      );
    });

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal error' },
    ])(
      'should throw an error if the server response status is not the expected successful one',
      async ({ status, message }) => {
        response = { status: status, data: message };
        httpClient = new FakeHttpClient(response);
        const client = new PlaylistsHTTPClient(
          url,
          httpClient,
          authHeaderBuilder
        );

        const expectedMessage = `Unexpected playlist create response status: ${status}: ${message}`;
        await expect(
          client.createPlaylist(token, playlistData)
        ).rejects.toThrow(expectedMessage);
      }
    );

    it('should throw an error if the header builder fails', async () => {
      mockHttpClientResponse();
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('Authentication failed');
      });
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(
        client.createPlaylist(token, playlistData)
      ).rejects.toThrow();
    });
  });

  describe('updatePlaylist', () => {
    let url: string;
    let token: string;
    let playlistData: UpdatePlaylistDTO;
    let httpClient: FakeHttpClient;
    let response: HttpResponse;
    let authHeaderBuilder: AuthHeaderBuilder;

    beforeEach(() => {
      url = 'http://some_url';
      token = 'my-token';
      playlistData = {
        playlistId: '123',
        artists: [{ name: 'Artist 3' }, { name: 'Artist 4' }],
      };
      authHeaderBuilder = new AuthHeaderBuilderStub();
    });

    const mockHttpClientResponse = (status: number = 200) => {
      response = {
        data: {
          playlist: {
            id: '123',
          },
        },
        status,
      };
      httpClient = new FakeHttpClient(response);
    };

    it('should call the client with the correct parameters', async () => {
      mockHttpClientResponse();
      const headers = { authorization: 'Bearer token' };
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        new AuthHeaderBuilderStub(headers)
      );
      vi.spyOn(httpClient, 'send');

      await client.updatePlaylist(token, playlistData);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists/${playlistData.playlistId}`,
        method: Method.Put,
        data: {
          artists: playlistData.artists,
        },
        headers: headers,
      });
    });

    it.each([
      { status: 200, expectedStatus: CreatedPlaylistStatus.OK },
      { status: 207, expectedStatus: CreatedPlaylistStatus.MISSING_ARTISTS },
    ])(
      'should return the response data with the correct status when HTTP status is $status',
      async ({ status, expectedStatus }) => {
        mockHttpClientResponse(status);
        const client = new PlaylistsHTTPClient(
          url,
          httpClient,
          authHeaderBuilder
        );

        const result = await client.updatePlaylist(token, playlistData);

        const expectedResponse = {
          status: expectedStatus,
        };
        expect(result).toEqual(expectedResponse);
      }
    );

    it('should throw an error if the HTTP client fails', async () => {
      mockHttpClientResponse();
      const errorMessage = 'Failed to update playlist';
      httpClient.setSendErrorMessage(errorMessage);
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(client.updatePlaylist(token, playlistData)).rejects.toThrow(
        errorMessage
      );
    });

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal error' },
    ])(
      'should throw an error if the server response status is not the expected successful one',
      async ({ status, message }) => {
        response = { status: status, data: message };
        httpClient = new FakeHttpClient(response);
        const client = new PlaylistsHTTPClient(
          url,
          httpClient,
          authHeaderBuilder
        );

        const expectedMessage = `Unexpected playlist update response status: ${status}: ${message}`;
        await expect(
          client.updatePlaylist(token, playlistData)
        ).rejects.toThrow(expectedMessage);
      }
    );

    it('should throw an error if the header builder fails', async () => {
      mockHttpClientResponse();
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('Authentication failed');
      });
      const client = new PlaylistsHTTPClient(
        url,
        httpClient,
        authHeaderBuilder
      );

      await expect(
        client.updatePlaylist(token, playlistData)
      ).rejects.toThrow();
    });
  });
});
