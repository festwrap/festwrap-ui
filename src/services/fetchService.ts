export interface IFetchService {
  fetchData<T>(_url: string, _options?: RequestInit): Promise<T>;
}

export class FetchService implements IFetchService {
  async fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };

    const response = await fetch(url, mergedOptions);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }
}
