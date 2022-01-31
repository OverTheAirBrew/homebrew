import axios from 'axios';
import { IHttpClient, RequestConfig } from './plugin/http-client';

export class HttpClient implements IHttpClient {
  async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    try {
      const response = config
        ? await axios.post<TResponse>(path, payload, config)
        : await axios.post<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }

  async patch<TRequest, TResponse>(
    path: string,
    payload: TRequest,
  ): Promise<TResponse> {
    try {
      const response = await axios.patch<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }

  async put<TRequest, TResponse>(
    path: string,
    payload: TRequest,
  ): Promise<TResponse> {
    try {
      const response = await axios.put<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    try {
      const response = await axios.get<TResponse>(path);
      return response.data;
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }
}
