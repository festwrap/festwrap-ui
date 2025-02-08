import { AuthClient } from './auth';

interface BaseClientWithAuth {
  buildAuthHeader: () => Promise<Record<string, string>>;
}

export class BaseHTTPClientWithAuth implements BaseClientWithAuth {
  private authClient?: AuthClient | undefined;

  constructor(authClient?: AuthClient) {
    this.authClient = authClient;
  }

  async buildAuthHeader(): Promise<Record<string, string>> {
    if (this.authClient === undefined) {
      return {};
    }

    const authToken = await this.authClient.getToken();
    return {
      [this.authClient.getHeaderName()]: `Bearer ${authToken}`,
    };
  }
}
