import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Artist } from '@/lib/artists';
import { ArtistsHTTPBackendClient } from './artists-backend';
import { FakeHttpClient, HttpResponse, Method } from './http';
import { FakeAuthClient } from './auth';

describe('ArtistsHTTPBackendClient', () => {
  let url: string;
  let token: string;
  let name: string;
  let limit: number;
  let httpClient: FakeHttpClient;
  let response: HttpResponse;

  beforeEach(() => {
    url = 'http://some_url';
    token = 'my-token';
    name = 'Iron';
    limit = 5;
    response = {
      data: [
        { name: 'Iron Chic', imageUri: 'https://some_image' },
        { name: 'Iron Maiden' },
      ],
      status: 200,
    };
    httpClient = new FakeHttpClient(response);
  });

  it('should call the client with the correct parameters', async () => {
    const client = new ArtistsHTTPBackendClient(url, httpClient);
    vi.spyOn(httpClient, 'send');

    await client.searchArtists(token, name, limit);

    expect(httpClient.send).toHaveBeenCalledWith({
      url: `${url}/artists/search`,
      method: Method.Get,
      params: { name: name, limit: limit },
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('should call the client with an additional auth header if auth client is provided', async () => {
    const authHeader = 'Some-Header';
    const authToken = 'some-token';
    const authClient = new FakeAuthClient(authToken, authHeader);
    const client = new ArtistsHTTPBackendClient(url, httpClient, authClient);
    vi.spyOn(httpClient, 'send');

    await client.searchArtists(token, name, limit);

    expect(httpClient.send).toHaveBeenCalledWith({
      url: `${url}/artists/search`,
      method: Method.Get,
      params: { name: name, limit: limit },
      headers: {
        Authorization: `Bearer ${token}`,
        [authHeader]: `Bearer ${authToken}`,
      },
    });
  });

  it('should return the list of artists returned by the HTTP client', async () => {
    const client = new ArtistsHTTPBackendClient(url, httpClient);

    const actual = await client.searchArtists(token, name, limit);

    const expected = [
      new Artist('Iron Chic', 'https://some_image'),
      new Artist('Iron Maiden'),
    ];
    expect(actual).toEqual(expected);
  });

  it('should throw an error if the HTTP client fails', async () => {
    const errorMessage = 'Request failed';
    httpClient.setSendErrorMessage(errorMessage);
    const client = new ArtistsHTTPBackendClient(url, httpClient);

    await expect(client.searchArtists(token, name, limit)).rejects.toThrow(
      errorMessage
    );
  });

  it('should throw an error if the auth client fails', async () => {
    const errorMessage = 'Auth request failed';
    const authClient = new FakeAuthClient('some-token', 'Some-Header');
    authClient.setGetTokenErrorMessage(errorMessage);
    const client = new ArtistsHTTPBackendClient(url, httpClient, authClient);

    await expect(client.searchArtists(token, name, limit)).rejects.toThrow(
      errorMessage
    );
  });
});
