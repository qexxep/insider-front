import { Options } from 'ky-universal';

export interface ApiClientConfig {
  baseUrl: string;
  defaultOptions?: Options;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'SUCCESS' | 'FAILURE' | 'ERROR'; // TODO
}
