'use client';

import { QUERY_KEYS, useCommonQuery } from '@/shared/api';

import { CategoryGroup, getCategories } from '../api/category';

// 카테고리 데이터는 자주 변경되지 않으므로 장시간 캐싱
export function useCategories() {
  return useCommonQuery<CategoryGroup[]>(QUERY_KEYS.CATEGORIES.ALL, getCategories, {
    gcTime: 24 * 60 * 60 * 1000, // 1일 동안 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
