/* eslint-disable no-unused-vars */
import axios from 'axios';

export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
}

export interface HttpRequest {
  url: string;
  method: Method;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
}

export interface HttpClient {
  send<T = unknown>(_request: HttpRequest): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
}

export class HttpBaseClient implements HttpClient {
  async send<T = unknown>({
    url,
    method,
    params,
    headers,
    data,
  }: HttpRequest): Promise<HttpResponse<T>> {
    const response = await axios({
      url,
      method,
      params,
      headers,
      data,
      validateStatus: (_) => true, // Always return the server response code
    });
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export class FakeHttpClient implements HttpClient {
  private sendErrorMessage: string | undefined = undefined;
  private result: HttpResponse;

  constructor(result: HttpResponse = { data: {}, status: 200 }) {
    this.result = result;
  }

  setResult(result: HttpResponse) {
    this.result = result;
  }

  setSendErrorMessage(message: string) {
    this.sendErrorMessage = message;
  }

  async send<T = unknown>(..._: unknown[]): Promise<HttpResponse<T>> {
    if (this.sendErrorMessage !== undefined) {
      throw new Error(this.sendErrorMessage);
    }
    return this.result as HttpResponse<T>;
  }
}
