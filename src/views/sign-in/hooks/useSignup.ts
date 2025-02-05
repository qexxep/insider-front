'use client';

import { useEffect, useState } from 'react';

import { initSignUp as initSignUpApi } from '../api/registers';

export const useSignup = () => {
  const [tempCode, setTempCode] = useState('');

  const initSignUp = async () => {
    const response = await initSignUpApi();
    setTempCode(response.data.tempCode);
  };

  useEffect(() => {
    initSignUp();
  }, []);

  return { tempCode };
};
