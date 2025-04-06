import { baseApi } from '@/shared/api';

import {
  ChangePasswordRequest,
  CheckOtpRequest,
  CheckOtpResponse,
  FindIdRequest,
  FindIdResponse,
  FindPasswordRequest,
  SendOtpRequest,
  SignInRequest,
  SignInResponse,
} from './types';

export const signOut = () => baseApi.get<void>('auth/sign-out');

export const createAccessToken = () => baseApi.post<void>('auth/create-access-token');

export const signIn = (data: SignInRequest) =>
  baseApi.post<SignInResponse>('auth/sign-in', { ...data, deviceType: 'V0VC' });

export const sendOtp = (data: SendOtpRequest) => baseApi.post<void>('auth/send-otp', data);

export const findPassword = (data: FindPasswordRequest) => baseApi.post<void>('auth/find-password', data);

export const findId = (data: FindIdRequest) => baseApi.post<FindIdResponse>('auth/find-id', data);

export const checkOtp = (data: CheckOtpRequest) => baseApi.post<CheckOtpResponse>('auth/check-otp', data);

export const changePassword = (data: ChangePasswordRequest) => baseApi.post<void>('auth/change-password', data);
