import apiClient from '@/shared/api/client';

interface LoginResponse {
  id: string;
  data: {
    accessToken: string;
  };
}

export const login = async (userId: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post('auth/sign-in', {
    json: { userId, password },
  });
  return response.json<LoginResponse>();
};

interface SendOtpRequest {
  otpPurpose: string;
  tempCode: string;
  userEmail: string;
}

interface SendOtpResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const sendOtp = async (payload: SendOtpRequest): Promise<SendOtpResponse> => {
  const response = await apiClient.post('auth/send-otp', {
    json: payload,
  });
  return response.json();
};

interface CheckOtpRequest {
  otpPurpose: string;
  tempCode: string;
  email: string;
  inputOtp: string;
}

interface CheckOtpResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const checkOtp = async (payload: CheckOtpRequest): Promise<CheckOtpResponse> => {
  const response = await apiClient.post('auth/check-otp', {
    json: payload,
  });
  return response.json();
};

interface SignOutResponse {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

export const signOut = async (): Promise<SignOutResponse> => {
  const response = await apiClient.get('auth/sign-out');
  return response.json();
};
