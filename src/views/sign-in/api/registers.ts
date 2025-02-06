import apiClient from '@/shared/api/client';

interface InitSignUpResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: {
    tempCode: string;
  };
}

export const initSignUp = async (): Promise<InitSignUpResponse> => {
  const response = await apiClient.post('/api/registers/sign-up-init');
  return response.json();
};

interface CheckDuplicateNicknameResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const checkDuplicateNickname = async (
  tempCode: string,
  userNickname: string
): Promise<CheckDuplicateNicknameResponse> => {
  const response = await apiClient.post('/api/registers/check-duplicate-nickname', {
    json: { tempCode, userNickname },
  });
  return response.json();
};

interface CheckDuplicateIdResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const checkDuplicateId = async (tempCode: string, userId: string): Promise<CheckDuplicateIdResponse> => {
  const response = await apiClient.post('/api/registers/check-duplicate-id', {
    json: { tempCode, userId },
  });
  return response.json();
};

interface SignUpRequest {
  tempCode: string;
  userId: string;
  password: string;
  confirmPassword: string;
  nickName: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface SignUpResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const signup = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiClient.post('/api/registers/sign-up', {
    json: payload,
  });
  return response.json();
};
