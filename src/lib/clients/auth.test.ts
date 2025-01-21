import { beforeEach, describe, it, expect, vi } from 'vitest';
import { GCPHTTPAuthClient } from './auth';
import { FakeHttpClient, HttpResponse, Method } from './http';

describe('HTTPAuthClient', () => {
  const audience = 'test-audience';
  let httpClient: FakeHttpClient;
  let response: HttpResponse;

  beforeEach(() => {
    response = { data: 'test-token', status: 200 };
    httpClient = new FakeHttpClient(response);
  });

  it('should call the client with the correct parameters', async () => {
    const authClient = new GCPHTTPAuthClient(httpClient, audience);
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
    const authClient = new GCPHTTPAuthClient(httpClient, audience);

    const actual = await authClient.getToken();

    expect(actual).toBe(expected);
  });

  it('should throw an error if the client fails', async () => {
    const errorMessage = 'Test error';
    httpClient.setSendErrorMessage('Test error');
    const authClient = new GCPHTTPAuthClient(httpClient, audience);

    await expect(authClient.getToken()).rejects.toThrow(errorMessage);
  });
});
