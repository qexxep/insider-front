import ky, { BeforeRequestHook } from 'ky-universal';

const getAccessTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
};

const setAuthorizationHeader: BeforeRequestHook = request => {
  const accessToken = getAccessTokenFromCookie();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }
};

const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : '/api';

const apiClient = ky.create({
  prefixUrl: baseUrl,
  hooks: {
    beforeRequest: [setAuthorizationHeader],
  },
});

export default apiClient;
