import { removeAccessToken, setAccessToken } from '@/shared/api/auth';

import { login as loginApi } from '../api/auth';

// TODO
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const response = await loginApi(email, password);
    setAccessToken(response.data.accessToken);
  };

  const logout = () => {
    removeAccessToken();
  };

  return { login, logout };
};
