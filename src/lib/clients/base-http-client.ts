import { AuthClient } from './auth';

interface BaseClientWithAuth {
  buildAuthHeader: (_spotifyToken: string) => Promise<Record<string, string>>;
}

export class BaseHTTPClientWithAuth implements BaseClientWithAuth {
  private authClient?: AuthClient | undefined;

  constructor(authClient?: AuthClient) {
    this.authClient = authClient;
  }

  async buildAuthHeader(
    spotifyToken?: string
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = spotifyToken
      ? { Authorization: `Bearer ${spotifyToken}` }
      : {};

    if (!this.authClient) return headers;

    return {
      ...headers,
      [this.authClient.getHeaderName()]: `Bearer ${await this.authClient.getToken()}`,
    };
  }
}
