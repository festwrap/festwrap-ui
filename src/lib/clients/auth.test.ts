import { beforeEach, describe, it, expect, vi } from 'vitest';
import { AuthClientStub, GCPAuthClient, BaseAuthHeaderBuilder } from './auth';
import { FakeHttpClient, HttpResponse, Method } from './http';

describe('GCPAuthClient', () => {
  const audience = 'test-audience';
  let httpClient: FakeHttpClient;
  let response: HttpResponse;

  beforeEach(() => {
    response = { data: 'test-token', status: 200 };
    httpClient = new FakeHttpClient(response);
  });

  it('should call the client with the correct parameters', async () => {
    const authClient = new GCPAuthClient(httpClient, audience);
    const baseUrl = 'http://some_url/auth';
    authClient.setBaseUrl(baseUrl);
    vi.spyOn(httpClient, 'send');

    await authClient.getToken();

    expect(httpClient.send).toHaveBeenCalledWith({
      url: baseUrl,
      method: Method.Get,
      params: { audience: audience },
      headers: { 'Metadata-Flavor': 'Google' },
    });
  });

  it('should return token from the client', async () => {
    const expected = 'some-token';
    httpClient.setResult({ data: expected, status: 200 });
    const authClient = new GCPAuthClient(httpClient, audience);

    const actual = await authClient.getToken();

    expect(actual).toBe(expected);
  });

  it('should throw an error if the client fails', async () => {
    const errorMessage = 'Test error';
    httpClient.setSendErrorMessage('Test error');
    const authClient = new GCPAuthClient(httpClient, audience);

    await expect(authClient.getToken()).rejects.toThrow(errorMessage);
  });

  it('should throw an error if the client status code is not ok', async () => {
    httpClient.setResult({ data: 'error', status: 500 });
    const authClient = new GCPAuthClient(httpClient, audience);

    await expect(authClient.getToken()).rejects.toThrow(
      'Failed to get token. Status code: 500'
    );
  });
});

describe('BaseAuthHeaderBuilder', () => {
  function createAuthClient() {
    const authHeader = 'X-Serverless-Authorization';
    const authToken = 'test-token';
    return new AuthClientStub(authToken, authHeader);
  }

  it('should call getToken and getHeaderName on authClient', async () => {
    const authClient = createAuthClient();
    vi.spyOn(authClient, 'getToken');
    vi.spyOn(authClient, 'getHeaderName');
    const client = new BaseAuthHeaderBuilder(authClient);

    await client.buildHeader();

    expect(authClient.getToken).toHaveBeenCalled();
    expect(authClient.getHeaderName).toHaveBeenCalled();
  });

  it('should return the correct auth header', async () => {
    const authClient = createAuthClient();
    const client = new BaseAuthHeaderBuilder(authClient);

    const headers = await client.buildHeader();

    expect(headers).toEqual({
      'X-Serverless-Authorization': 'Bearer test-token',
    });
  });

  it('should throw an error if the auth client fails', async () => {
    const errorMessage = 'Auth request failed';
    const authClient = createAuthClient();
    vi.spyOn(authClient, 'getToken').mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const client = new BaseAuthHeaderBuilder(authClient);

    await expect(client.buildHeader()).rejects.toThrow(errorMessage);
  });
});
