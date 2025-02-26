export const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
  throwOnError: false,
} as const;

export const DEFAULT_MUTATION_OPTIONS = {
  retry: 1,
  throwOnError: false,
} as const;

// 환경별 옵션 (development, production 등)
export const ENV_SPECIFIC_OPTIONS = {
  development: {
    queries: {
      retry: 0, // 개발환경에서는 retry 없음
    },
  },
  production: {
    queries: {
      retry: 3, // 운영환경에서는 retry 3회
    },
  },
} as const;
