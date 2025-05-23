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
  let url: string;
  let token: string;
  let httpClient: FakeHttpClient;
  let headers: Record<string, string>;
  let authHeaderBuilder: AuthHeaderBuilder;
  let client: PlaylistsHTTPClient;

  beforeEach(() => {
    url = 'http://some_url';
    token = 'my-token';
    headers = { Authorization: 'Bearer token' };
    authHeaderBuilder = new AuthHeaderBuilderStub(headers);
    httpClient = new FakeHttpClient();
    client = new PlaylistsHTTPClient(url, httpClient, authHeaderBuilder);
  });

  describe('searchPlaylists', () => {
    let name: string;
    let limit: number;
    let response: HttpResponse;

    beforeEach(() => {
      name = 'Chill';
      limit = 5;
      httpClient.setResult({
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
      });
    });

    it('should call the client with the correct parameters', async () => {
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

      await expect(client.searchPlaylists(token, name, limit)).rejects.toThrow(
        errorMessage
      );
    });

    it('should throw an error if the header builder fails', async () => {
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('test Error');
      });

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
    let createPlaylistData: CreateNewPlaylistDTO;

    function responseWithStatus(status: number = 201): HttpResponse {
      return {
        data: {
          playlist: {
            id: '123',
          },
        },
        status,
      };
    }

    beforeEach(() => {
      createPlaylistData = {
        playlist: {
          name: 'Festival Hits',
          description: 'All the best songs',
          isPublic: false,
        },
        artists: [{ name: 'Artist 1' }, { name: 'Artist 2' }],
      };
      httpClient.setResult(responseWithStatus(201));
    });

    it('should call the client with the correct parameters', async () => {
      vi.spyOn(httpClient, 'send');

      await client.createPlaylist(token, createPlaylistData);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists`,
        method: Method.Post,
        data: createPlaylistData,
        headers: headers,
      });
    });

    it.each([
      { status: 201, expectedStatus: CreatedPlaylistStatus.OK },
      { status: 207, expectedStatus: CreatedPlaylistStatus.MISSING_ARTISTS },
    ])(
      'should return the response data with the correct status when HTTP status is $status',
      async ({ status, expectedStatus }) => {
        const httpResponse = responseWithStatus(status);
        httpClient.setResult(httpResponse);

        const result = await client.createPlaylist(token, createPlaylistData);

        const expectedResponse = {
          id: httpResponse.data.playlist.id,
          status: expectedStatus,
        };
        expect(result).toEqual(expectedResponse);
      }
    );

    it('should throw an error if the HTTP client fails', async () => {
      const errorMessage = 'Failed to create playlist';
      httpClient.setSendErrorMessage(errorMessage);

      await expect(
        client.createPlaylist(token, createPlaylistData)
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal error' },
    ])(
      'should throw an error if the server response status is not the expected successful one',
      async ({ status, message }) => {
        const httpResponse = { status: status, data: message };
        httpClient.setResult(httpResponse);

        const expectedMessage = `Unexpected playlist create response status: ${status}: ${message}`;
        await expect(
          client.createPlaylist(token, createPlaylistData)
        ).rejects.toThrow(expectedMessage);
      }
    );

    it('should throw an error if the header builder fails', async () => {
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      await expect(
        client.createPlaylist(token, createPlaylistData)
      ).rejects.toThrow();
    });
  });

  describe('updatePlaylist', () => {
    let updatePlaylistData: UpdatePlaylistDTO;

    function responseWithStatus(status: number = 201): HttpResponse {
      return {
        data: {},
        status: status,
      };
    }

    beforeEach(() => {
      updatePlaylistData = {
        playlistId: '123',
        artists: [{ name: 'Artist 3' }, { name: 'Artist 4' }],
      };
      httpClient.setResult(responseWithStatus(200));
    });

    it('should call the client with the correct parameters', async () => {
      vi.spyOn(httpClient, 'send');

      await client.updatePlaylist(token, updatePlaylistData);

      expect(httpClient.send).toHaveBeenCalledWith({
        url: `${url}/playlists/${updatePlaylistData.playlistId}`,
        method: Method.Put,
        data: {
          artists: updatePlaylistData.artists,
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
        const httpResponse = responseWithStatus(status);
        httpClient.setResult(httpResponse);

        const result = await client.updatePlaylist(token, updatePlaylistData);

        const expectedResponse = {
          status: expectedStatus,
        };
        expect(result).toEqual(expectedResponse);
      }
    );

    it('should throw an error if the HTTP client fails', async () => {
      const errorMessage = 'Failed to update playlist';
      httpClient.setSendErrorMessage(errorMessage);

      await expect(
        client.updatePlaylist(token, updatePlaylistData)
      ).rejects.toThrow(errorMessage);
    });

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal error' },
    ])(
      'should throw an error if the server response status is not the expected successful one',
      async ({ status, message }) => {
        const httpResponse = { status: status, data: message };
        httpClient.setResult(httpResponse);

        const expectedMessage = `Unexpected playlist update response status: ${status}: ${message}`;
        await expect(
          client.updatePlaylist(token, updatePlaylistData)
        ).rejects.toThrow(expectedMessage);
      }
    );

    it('should throw an error if the header builder fails', async () => {
      vi.spyOn(authHeaderBuilder, 'buildHeader').mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      await expect(
        client.updatePlaylist(token, updatePlaylistData)
      ).rejects.toThrow();
    });
  });
});
