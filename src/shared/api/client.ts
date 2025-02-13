import ky, { BeforeRequestHook } from 'ky-universal';

import { getLocalStorage } from '../utils';

const setAuthorizationHeader: BeforeRequestHook = request => {
  // 서버에서 실행되지 않기 위한 조건 추가
  if (typeof window !== 'undefined') {
    const accessToken = getLocalStorage('accessToken');
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }
};

const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL : '/api/';

const apiClient = ky.create({
  prefixUrl: baseUrl,
  hooks: {
    beforeRequest: [setAuthorizationHeader],
  },
});

export default apiClient;
