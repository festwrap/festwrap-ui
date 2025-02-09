import { BaseHTTPClientWithAuth } from './base-backend';
import { AuthClient } from './auth';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('BaseHTTPClientWithAuth', () => {
  let authClient: AuthClient;

  beforeEach(() => {
    authClient = {
      getToken: vi.fn().mockResolvedValue('test-token'),
      getHeaderName: vi.fn().mockReturnValue('X-Serverless-Authorization'),
    } as unknown as AuthClient;
  });

  it('should return an empty object if authClient is undefined', async () => {
    const client = new BaseHTTPClientWithAuth();
    const headers = await client.buildAuthHeader();
    expect(headers).toEqual({});
  });

  it('should return the correct auth header if authClient is defined', async () => {
    const client = new BaseHTTPClientWithAuth(authClient);
    const headers = await client.buildAuthHeader();
    expect(headers).toEqual({
      'X-Serverless-Authorization': 'Bearer test-token',
    });
  });

  it('should call getToken and getHeaderName on authClient', async () => {
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
    const client = new BaseHTTPClientWithAuth(authClient);
    const spotifyToken = 'spotify-token';
    const headers = await client.buildAuthHeader(spotifyToken);
    expect(headers).toEqual({
      Authorization: 'Bearer spotify-token',
      'X-Serverless-Authorization': 'Bearer test-token',
    });
  });
});
