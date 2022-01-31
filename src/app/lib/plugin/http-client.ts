import { ClassType } from './class-type';

export type RequestConfig = {
  headers: Record<string, string>;
};

export interface IHttpClient {
  post<TRequest, TResponse>(
    path: string,
    object: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse>;
  patch<TRequest, TResponse>(
    path: string,
    object: TRequest,
  ): Promise<TResponse>;
  put<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>;
  get<TResponse>(path: string): Promise<TResponse>;
}

export const IHttpClient = class Dummy {} as ClassType<IHttpClient>;
