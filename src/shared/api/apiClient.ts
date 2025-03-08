import ky, { BeforeRequestHook, Options } from 'ky-universal';

import type { ApiClientConfig, ApiResponse } from './types';

const getClientAccessToken = (): string | null => {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
};

const getServerAccessToken = async (): Promise<string | null> => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value ?? null;
};

const createAuthHeaderHook = (isServer: boolean): BeforeRequestHook => {
  return async request => {
    try {
      const token = isServer ? await getServerAccessToken() : getClientAccessToken();

      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Failed to set auth header:', error);
    }
  };
};

export const createApiClient = (config: ApiClientConfig) => {
  const isServer = typeof window === 'undefined';

  // 기본 설정
  const defaultOptions: Options = {
    headers: {
      'Content-Type': 'application/json',
    },
    hooks: {
      beforeRequest: [createAuthHeaderHook(isServer)],
    },
    timeout: 30000,
    ...config.defaultOptions,
  };

  // 클라이언트/서버 인스턴스 생성
  const client = ky.create({
    prefixUrl: config.baseUrl,
    ...defaultOptions,
  });

  const serverClient = ky.create({
    prefixUrl: config.baseUrl,
    ...defaultOptions,
    fetch: fetch,
  });

  const getInstance = () => (typeof window === 'undefined' ? serverClient : client);

  return {
    get: async <T>(endpoint: string, options?: Options) => {
      const instance = getInstance();
      return instance.get(endpoint, options).json<ApiResponse<T>>();
    },

    post: async <T>(endpoint: string, data?: unknown, options?: Options) => {
      const instance = getInstance();
      return instance.post(endpoint, { json: data, ...options }).json<ApiResponse<T>>();
    },

    put: async <T>(endpoint: string, data?: unknown, options?: Options) => {
      const instance = getInstance();
      return instance.put(endpoint, { json: data, ...options }).json<ApiResponse<T>>();
    },

    delete: async <T>(endpoint: string, options?: Options) => {
      const instance = getInstance();
      return instance.delete(endpoint, options).json<ApiResponse<T>>();
    },
  };
};
