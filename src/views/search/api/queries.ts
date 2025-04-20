import { useQuery } from '@tanstack/react-query';

import { queryClient } from '@/shared/lib';

import { getSearchResults } from './search';
import { SearchRequest } from './types';

// 1. Query key generator for search
export const searchQueryKey = (params: SearchRequest) => ['search', params] as const;

// 2. Invalidate utility for search
export const invalidateSearchQuery = (params: SearchRequest) => {
  return queryClient.invalidateQueries({ queryKey: searchQueryKey(params) });
};

// (Optional) 3. Prefetch utility for search
export const prefetchSearchQuery = async (params: SearchRequest) => {
  await queryClient.prefetchQuery({
    queryKey: searchQueryKey(params),
    queryFn: () => getSearchResults(params),
    staleTime: 30000,
  });
};

// 4. The hook itself, now using the key generator
export const useSearchQuery = (params: SearchRequest, enabled = true) => {
  return useQuery({
    queryKey: searchQueryKey(params),
    queryFn: () => getSearchResults(params),
    enabled,
    select: data => {
      if (!data) {
        return { totalCount: 0, result: [] };
      }
      return data.data || { totalCount: 0, result: [] };
    },
    placeholderData: previousData => previousData,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
