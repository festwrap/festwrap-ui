import { HttpClient, Method } from './http';

export interface GCPAuthClient {
  getToken(): Promise<string>;
  getHeaderName(): string;
}

export class GCPHTTPAuthClient {
  private httpClient: HttpClient;
  private baseUrl: string =
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity';
  private audience: string;

  constructor(httpClient: HttpClient, audience: string) {
    this.httpClient = httpClient;
    this.audience = audience;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getToken(): Promise<string> {
    return this.httpClient
      .send({
        url: this.baseUrl,
        method: Method.Get,
        params: { audience: this.audience },
        headers: { 'Metadata-Flavor': 'Google' },
      })
      .then((response) => response.data);
  }

  getHeaderName(): string {
    return 'X-Serverless-Authorization';
  }
}

export class FakeGCPAuthClient {
  private header: string;
  private token: string;
  private getTokenErrorMessage: string | undefined = undefined;

  constructor(token: string, header: string) {
    this.token = token;
    this.header = header;
  }

  setToken(token: string) {
    this.token = token;
  }

  setGetTokenErrorMessage(message: string) {
    this.getTokenErrorMessage = message;
  }

  async getToken(): Promise<string> {
    if (this.getTokenErrorMessage !== undefined) {
      throw new Error(this.getTokenErrorMessage);
    }
    return this.token;
  }

  getHeaderName(): string {
    return this.header;
  }
}

export interface AuthHeaderBuilder {
  buildHeader: (_spotifyToken: string) => Promise<Record<string, string>>;
}

export class HTTPAuthHeaderBuilder implements AuthHeaderBuilder {
  private gcpAuthClient?: GCPAuthClient | undefined;

  constructor(gcpAuthClient?: GCPAuthClient) {
    this.gcpAuthClient = gcpAuthClient;
  }

  async buildHeader(spotifyToken?: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = spotifyToken
      ? { Authorization: `Bearer ${spotifyToken}` }
      : {};

    if (!this.gcpAuthClient) return headers;

    return {
      ...headers,
      [this.gcpAuthClient.getHeaderName()]: `Bearer ${await this.gcpAuthClient.getToken()}`,
    };
  }
}

export class FakeHTTPAuthHeaderBuilder implements AuthHeaderBuilder {
  private gcpAuthToken: string | undefined;
  private gcpAuthHeaderName: string | undefined;

  constructor(gcpAuthToken?: string, gcpAuthHeaderName?: string) {
    this.gcpAuthToken = gcpAuthToken;
    this.gcpAuthHeaderName = gcpAuthHeaderName;
  }

  async buildHeader(spotifyToken: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = spotifyToken
      ? { Authorization: `Bearer ${spotifyToken}` }
      : {};

    if (!this.gcpAuthToken || !this.gcpAuthHeaderName) return headers;

    return {
      ...headers,
      [this.gcpAuthHeaderName]: `Bearer ${this.gcpAuthToken}`,
    };
  }
}
