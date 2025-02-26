import { QueryClient } from '@tanstack/react-query';

import { DEFAULT_MUTATION_OPTIONS, DEFAULT_QUERY_OPTIONS, ENV_SPECIFIC_OPTIONS } from './options';

// 현재 환경에 따른 옵션 가져오기
const envOptions = ENV_SPECIFIC_OPTIONS[process.env.NODE_ENV as keyof typeof ENV_SPECIFIC_OPTIONS] || {};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...DEFAULT_QUERY_OPTIONS,
        ...envOptions.queries,
      },
      mutations: {
        ...DEFAULT_MUTATION_OPTIONS,
      },
    },
  });
}
