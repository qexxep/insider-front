'use client';

import { useCommonQuery } from '@/shared/hooks/query/useCommonQuery';

import { CategoryGroup, getCategories } from '../api/category';

// 카테고리 데이터는 크게 변화할 이유가 없으므로 캐싱을 길게 설정
export function useCategories() {
  return useCommonQuery<CategoryGroup[]>(['categories'], getCategories, {
    staleTime: Infinity, // 데이터를 항상 fresh하게 유지 (리페치 방지)
    gcTime: 24 * 60 * 60 * 1000, // 24시간 동안 캐시 유지
    refetchOnMount: false, // 컴포넌트 마운트시 리페치 방지
    refetchOnWindowFocus: false, // 윈도우 포커스시 리페치 방지
    refetchOnReconnect: false, // 재연결시 리페치 방지
  });
}
