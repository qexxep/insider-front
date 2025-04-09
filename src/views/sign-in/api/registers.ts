import { baseApi } from '@/shared/api';

import { CheckDuplicateIdRequest, CheckDuplicateNicknameRequest, SignUpInitResponse, SignUpRequest } from './types';

export const signUp = (data: SignUpRequest) => baseApi.post<void>('registers/sign-up', data);

export const signUpInit = () => baseApi.get<SignUpInitResponse>('registers/sign-up-init');

export const checkDuplicateNickname = (data: CheckDuplicateNicknameRequest) =>
  baseApi.post<void>('registers/check-duplicate-nickname', data);

export const checkDuplicateId = (data: CheckDuplicateIdRequest) =>
  baseApi.post<void>('registers/check-duplicate-id', data);
