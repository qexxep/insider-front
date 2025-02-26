// useCommonQuery.ts

import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ApiResponse } from '@/shared/api/types';

// 기본 옵션 정의 (TO DO: 논의 후 수정 예정)
const defaultOptions = {
  retry: 1,
  gcTime: 0,
  staleTime: 60 * 1000,
};

// 커스텀 옵션 타입 정의
export type CommonQueryOptions<TData, TError> = Omit<
  UseQueryOptions<ApiResponse<TData>, TError, ApiResponse<TData>, QueryKey>,
  'queryKey' | 'queryFn'
>;

export function useCommonQuery<TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: CommonQueryOptions<TData, Error>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...defaultOptions,
    ...options,
  });
}
