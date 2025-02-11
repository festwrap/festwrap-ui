import { BaseHTTPClientWithAuth } from './base-http-client';
import { FakeAuthClient } from './auth';
import { describe, it, expect, vi } from 'vitest';

describe('BaseHTTPClientWithAuth', () => {
  function createAuthClient() {
    const authHeader = 'X-Serverless-Authorization';
    const authToken = 'test-token';
    return new FakeAuthClient(authToken, authHeader);
  }

  it('should return an empty object if authClient is undefined', async () => {
    const client = new BaseHTTPClientWithAuth();
    const headers = await client.buildAuthHeader();
    expect(headers).toEqual({});
  });

  it('should return the correct auth header if authClient is defined', async () => {
    const authClient = createAuthClient();
    const client = new BaseHTTPClientWithAuth(authClient);
    const headers = await client.buildAuthHeader();
    expect(headers).toEqual({
      'X-Serverless-Authorization': 'Bearer test-token',
    });
  });

  it('should call getToken and getHeaderName on authClient', async () => {
    const authClient = createAuthClient();
    vi.spyOn(authClient, 'getToken');
    vi.spyOn(authClient, 'getHeaderName');
    const client = new BaseHTTPClientWithAuth(authClient);
    await client.buildAuthHeader();
    expect(authClient.getToken).toHaveBeenCalled();
    expect(authClient.getHeaderName).toHaveBeenCalled();
  });

  it('should return the correct auth header if spotifyToken is provided', async () => {
    const client = new BaseHTTPClientWithAuth();
    const spotifyToken = 'spotify-token';
    const headers = await client.buildAuthHeader(spotifyToken);
    expect(headers).toEqual({ Authorization: 'Bearer spotify-token' });
  });

  it('should return the correct auth header if authClient and spotifyToken are provided', async () => {
    const authClient = createAuthClient();
    const client = new BaseHTTPClientWithAuth(authClient);
    const spotifyToken = 'spotify-token';
    const headers = await client.buildAuthHeader(spotifyToken);
    expect(headers).toEqual({
      Authorization: 'Bearer spotify-token',
      'X-Serverless-Authorization': 'Bearer test-token',
    });
  });
});
