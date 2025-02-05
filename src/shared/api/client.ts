import ky, { BeforeRequestHook } from 'ky-universal';

import { getAccessToken } from './auth';

const setAuthorizationHeader: BeforeRequestHook = request => {
  const accessToken = getAccessToken();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }
};

const baseApiClient = ky.create({
  prefixUrl: 'http://inssider.kro.kr/api',
});

const apiClient = baseApiClient.extend({
  hooks: {
    beforeRequest: [setAuthorizationHeader],
  },
});

export default apiClient;
