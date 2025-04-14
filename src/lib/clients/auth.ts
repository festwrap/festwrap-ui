import { HttpClient, Method } from './http';

export interface AuthClient {
  getToken(): Promise<string>;
  getHeaderName(): string;
}

export class GCPAuthClient implements AuthClient {
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
    const tokenResponse = await this.httpClient.send({
      url: this.baseUrl,
      method: Method.Get,
      params: { audience: this.audience },
      headers: { 'Metadata-Flavor': 'Google' },
    });
    if (tokenResponse.status !== 200) {
      throw new Error(
        'Failed to get token. Status code: ' + tokenResponse.status
      );
    } else {
      return tokenResponse.data;
    }
  }

  getHeaderName(): string {
    return 'X-Serverless-Authorization';
  }
}

export class AuthClientStub implements AuthClient {
  private header: string;
  private token: string;

  constructor(token: string, header: string) {
    this.token = token;
    this.header = header;
  }

  setToken(token: string) {
    this.token = token;
  }

  async getToken(): Promise<string> {
    return this.token;
  }

  getHeaderName(): string {
    return this.header;
  }
}

export interface AuthHeaderBuilder {
  buildHeader: (_token: string) => Promise<Record<string, string>>;
}

export class BaseAuthHeaderBuilder implements AuthHeaderBuilder {
  private gcpAuthClient?: AuthClient | undefined;

  constructor(gcpAuthClient?: AuthClient) {
    this.gcpAuthClient = gcpAuthClient;
  }

  async buildHeader(token: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (!this.gcpAuthClient) return headers;

    return {
      ...headers,
      [this.gcpAuthClient.getHeaderName()]: `Bearer ${await this.gcpAuthClient.getToken()}`,
    };
  }
}

export class AuthHeaderBuilderStub implements AuthHeaderBuilder {
  private headers: Record<string, string>;

  constructor(headers: Record<string, string> = {}) {
    this.headers = headers;
  }

  async buildHeader(_token: string): Promise<Record<string, string>> {
    return this.headers;
  }
}
