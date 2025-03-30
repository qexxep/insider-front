import ky, { AfterResponseHook, BeforeRequestHook, Options } from 'ky-universal';

import type { ApiClientConfig, ApiResponse } from './types';

const getClientAccessToken = (): string | null => {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
};

const getClientRefreshToken = (): string | null => {
  const match = document.cookie.match(/refresh_token=([^;]+)/);
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

interface RefreshTokenResponse {
  data: {
    jwt: {
      accessToken: string;
    };
  };
}

const handle401Error: AfterResponseHook = async (request, options, response) => {
  const isServer = typeof window === 'undefined';
  if (isServer) return;

  const refreshToken = getClientRefreshToken();

  if (response.status === 401) {
    try {
      const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : '/api';

      // 새로운 access token 발급
      const response = await ky.get('auth/create-access-token', {
        prefixUrl: baseUrl,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = await response.json<RefreshTokenResponse>();
      const newAccessToken = data.data.jwt.accessToken;

      // 새로운 token으로 요청 재시도
      document.cookie = `access_token=${newAccessToken}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString()}`;
      request.headers.set('Authorization', `Bearer ${newAccessToken}`);
      return await ky(request);
    } catch (error) {
      // token 갱신 실패 시 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/sign-in';
      }
      throw error;
    }
  }
  return response;
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
      afterResponse: [handle401Error],
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
