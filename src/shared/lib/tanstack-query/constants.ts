export const QUERY_CONFIG = {
  REAL_TIME: {
    staleTime: 0, // 실시간 데이터
    refetchInterval: 1000, // 1초마다 갱신
  },
  STATIC: {
    staleTime: Infinity, // 정적 데이터
    cacheTime: Infinity,
  },
  REGULAR: {
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 30, // 30분
  },
} as const;
