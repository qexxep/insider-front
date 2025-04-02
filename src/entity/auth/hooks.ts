'use client';

import { useCookies } from 'next-client-cookies';
import { useEffect, useState } from 'react';

import { LOGIN_REQUIRED_EVENT } from './consts';

export const useAuth = () => {
  const cookies = useCookies();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getLoginStatus = () => {
    const accessToken = cookies.get('access_token');
    return !!accessToken;
  };

  const checkLogin = () => {
    try {
      if (!isLoggedIn) {
        window.dispatchEvent(new CustomEvent(LOGIN_REQUIRED_EVENT));
        return false;
      }
      return true;
    } catch (error: unknown) {
      console.error('Error checking login:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        setIsLoggedIn(getLoginStatus());
      } catch (error: unknown) {
        // 클라이언트 사이드 체크
        if (error instanceof Error && error.message.includes('client-side')) {
          console.warn('Auth check should only run on client-side');
        }
        // 기본적으로 비로그인 상태로 설정
        setIsLoggedIn(false);
      }
    };

    // 초기 체크
    checkAuth();

    // 쿠키 변경 감지
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return { isLoggedIn, checkLogin };
};
