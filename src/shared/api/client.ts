import ky, { BeforeRequestHook } from 'ky-universal';

import { getLocalStorage } from '../utils';

const setAuthorizationHeader: BeforeRequestHook = request => {
  const accessToken = getLocalStorage('accessToken');
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }
};

const baseApiClient = ky.create({
  // prefixUrl: 'http://inssider.kro.kr/api',
});

const apiClient = baseApiClient.extend({
  hooks: {
    beforeRequest: [setAuthorizationHeader],
  },
});

export default apiClient;
