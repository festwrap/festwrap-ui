import { HttpClient, Method } from './http';

export interface AuthClient {
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
