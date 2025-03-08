import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: 1,
      onError: error => {
        // 전역 에러 처리
        console.error('Mutation error:', error);
      },
    },
  },
});
