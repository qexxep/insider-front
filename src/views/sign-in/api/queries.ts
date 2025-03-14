import {
  QueryClient,
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api';
import { QUERY_CONFIG, queryClient } from '@/shared/lib';

import { changePassword, checkOtp, createAccessToken, findId, findPassword, sendOtp, signIn, signOut } from './auth';
import { checkDuplicateId, checkDuplicateNickname, signUp, signUpInit } from './registers';
import {
  ChangePasswordRequest,
  CheckDuplicateIdRequest,
  CheckDuplicateNicknameRequest,
  CheckOtpRequest,
  FindIdRequest,
  FindPasswordRequest,
  SendOtpRequest,
  SignInRequest,
  SignInResponse,
  SignUpInitResponse,
  SignUpRequest,
} from './types';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    signOut: () => [...queryKeys.auth.all, 'signOut'] as const,
    createAccessToken: () => [...queryKeys.auth.all, 'createAccessToken'] as const,
    signIn: (payload: SignInRequest) => [...queryKeys.auth.all, 'signIn', payload] as const,
    sendOtp: (payload: SendOtpRequest) => [...queryKeys.auth.all, 'sendOtp', payload] as const,
    findPassword: (payload: FindPasswordRequest) => [...queryKeys.auth.all, 'findPassword', payload] as const,
    findId: (payload: FindIdRequest) => [...queryKeys.auth.all, 'findId', payload] as const,
    checkOtp: (payload: CheckOtpRequest) => [...queryKeys.auth.all, 'checkOtp', payload] as const,
    changePassword: (payload: ChangePasswordRequest) => [...queryKeys.auth.all, 'changePassword', payload] as const,
  },
  registers: {
    all: ['registers'] as const,
    signUpInit: () => [...queryKeys.registers.all, 'signUpInit'] as const,
  },
} as const;

export const invalidateQueries = {
  auth: {
    all: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
  },
  registers: {
    all: () => queryClient.invalidateQueries({ queryKey: queryKeys.registers.all }),
    signUpInit: () => queryClient.invalidateQueries({ queryKey: queryKeys.registers.signUpInit() }),
  },
};

export const prefetchQueries = {
  registers: {
    signUpInit: async (queryClient: QueryClient) => {
      await queryClient.prefetchQuery({ queryKey: queryKeys.registers.signUpInit(), queryFn: () => signUpInit() });
    },
  },
};

// Auth

export const useSignOut = (config?: UseMutationOptions<ApiResponse<void>, Error, void>) => {
  return useMutation({
    mutationFn: signOut,
    ...config,
  });
};

export const useCreateAccessToken = (config?: UseMutationOptions<ApiResponse<void>, Error, void>) => {
  return useMutation({
    mutationFn: createAccessToken,
    ...config,
  });
};

export const useSignIn = (config?: UseMutationOptions<ApiResponse<SignInResponse>, Error, SignInRequest>) => {
  return useMutation({
    mutationFn: async (payload: SignInRequest) => {
      const response = await signIn(payload);
      if (response.status === 'SUCCESS') {
        return response;
      }
      return Promise.reject(response);
    },
    ...config,
  });
};

export const useSendOtp = (config?: UseMutationOptions<ApiResponse<void>, Error, SendOtpRequest>) => {
  return useMutation({
    mutationFn: (payload: SendOtpRequest) => sendOtp(payload),
    ...config,
  });
};

export const useFindPassword = (config?: UseMutationOptions<ApiResponse<void>, Error, FindPasswordRequest>) => {
  return useMutation({
    mutationFn: (payload: FindPasswordRequest) => findPassword(payload),
    ...config,
  });
};

export const useFindId = (config?: UseMutationOptions<ApiResponse<void>, Error, FindIdRequest>) => {
  return useMutation({
    mutationFn: (payload: FindIdRequest) => findId(payload),
    ...config,
  });
};

export const useCheckOtp = (config?: UseMutationOptions<ApiResponse<void>, Error, CheckOtpRequest>) => {
  return useMutation({
    mutationFn: (payload: CheckOtpRequest) => checkOtp(payload),
    ...config,
  });
};

export const useChangePassword = (config?: UseMutationOptions<ApiResponse<void>, Error, ChangePasswordRequest>) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
    ...config,
  });
};

// Registers
export const useSignUp = (config?: UseMutationOptions<ApiResponse<void>, Error, SignUpRequest>) => {
  return useMutation({
    mutationFn: (payload: SignUpRequest) => signUp(payload),
    ...config,
  });
};

export const useSignUpInit = (config?: UseQueryOptions<ApiResponse<SignUpInitResponse>>) => {
  return useQuery({
    queryKey: queryKeys.registers.signUpInit(),
    queryFn: signUpInit,
    ...QUERY_CONFIG.REGULAR,
    ...config,
  });
};

export const useCheckDuplicateNickname = (
  config?: UseMutationOptions<ApiResponse<void>, Error, CheckDuplicateNicknameRequest>
) => {
  return useMutation({
    mutationFn: async (payload: CheckDuplicateNicknameRequest) => {
      const response = await checkDuplicateNickname(payload);
      if (response.status === 'SUCCESS') {
        return response;
      }
      return Promise.reject(response);
    },
    ...config,
  });
};

export const useCheckDuplicateId = (config?: UseMutationOptions<ApiResponse<void>, Error, CheckDuplicateIdRequest>) => {
  return useMutation({
    mutationFn: async (payload: CheckDuplicateIdRequest) => {
      const response = await checkDuplicateId(payload);
      if (response.status === 'SUCCESS') {
        return response;
      }
      return Promise.reject(response);
    },
    ...config,
  });
};
